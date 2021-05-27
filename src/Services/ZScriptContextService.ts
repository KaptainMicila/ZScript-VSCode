import ZScriptContext from "../Classes/ZScriptContext";
import * as vscode from "vscode";
import { ContextType } from "../BuiltIn/enums";
import ZScriptError from "../Classes/ZScriptError";
import * as ZScriptErrorService from "./ZScriptErrorService";

export async function orderContextArray(contextArray: ZScriptContext[]): Promise<void> {
    for (const context of contextArray) {
        for (const otherContext of contextArray) {
            if (context !== otherContext) {
                if (otherContext.contains(context)) {
                    otherContext.innerContextes.push(context);
                    context.outherContext = otherContext;

                    break;
                }
            }
        }
    }
}

export async function verifyDocumentStructure(
    document: vscode.TextDocument,
    contextErrorsCollection: vscode.DiagnosticCollection
) {
    ZScriptErrorService.updateDiagnostics(
        document.uri,
        contextErrorsCollection,
        (await parseContextes(document)).contextErrors
    );
}

export async function parseContextes(document: vscode.TextDocument): Promise<{
    contextes: ZScriptContext[];
    contextErrors: ZScriptError[];
}> {
    const contextChanges: vscode.Position[][] = [[], [], []];
    const contextes: ZScriptContext[] = [];
    const contextErrors: ZScriptError[] = [];
    const commentRanges: vscode.Range[] = await parseComments(document);

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
        const line = document.lineAt(lineNumber);

        for (let characterIndex = 0; characterIndex < line.text.length; characterIndex++) {
            if (await isCommented(commentRanges, new vscode.Position(lineNumber, characterIndex))) {
                continue;
            }

            const character = line.text.charAt(characterIndex);
            let bracketType = ContextType.UnknownCurly;

            switch (character) {
                case "(":
                case ")":
                    bracketType = ContextType.UnknownRound;

                    break;
                case "[":
                case "]":
                    bracketType = ContextType.UnknownSquare;

                    break;
                case "{":
                case "}":
                    bracketType = ContextType.UnknownCurly;

                    break;
            }

            switch (character) {
                case "(":
                case "[":
                case "{":
                    contextChanges[bracketType].push(new vscode.Position(lineNumber, characterIndex + 1));

                    break;
                case ")":
                case "]":
                case "}":
                    contextChanges[bracketType].push(new vscode.Position(lineNumber, characterIndex));

                    try {
                        contextes.push(
                            new ZScriptContext(
                                contextChanges[bracketType].splice(contextChanges[bracketType].length - 2, 1)[0],
                                contextChanges[bracketType].splice(contextChanges[bracketType].length - 1, 1)[0],
                                bracketType
                            )
                        );
                    } catch (error) {
                        contextErrors.push(
                            new ZScriptError(
                                new vscode.Position(lineNumber, characterIndex),
                                new vscode.Position(lineNumber, characterIndex),
                                `"${["{", "(", "["][bracketType]}" expected somewhere!`
                            )
                        );
                    }

                    break;
            }
        }
    }

    if (contextChanges.length > 0) {
        ZScriptErrorService.tagUnclosedBrackets(contextChanges, contextErrors);
    }

    return { contextes, contextErrors };
}

export async function parseComments(document: vscode.TextDocument): Promise<vscode.Range[]> {
    const commentRanges: vscode.Range[] = [];
    let activeComment: vscode.Position | null = null;

    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
        if (await isCommented(commentRanges, new vscode.Position(lineNumber, 0))) {
            continue;
        }

        const line = document.lineAt(lineNumber);

        if (activeComment !== null) {
            if (line.text.includes("*/")) {
                commentRanges.push(
                    new vscode.Range(activeComment, new vscode.Position(lineNumber, line.text.indexOf("*/")))
                );

                activeComment = null;
            } else {
                continue;
            }
        }

        if (line.text.includes("//")) {
            commentRanges.push(
                new vscode.Range(
                    new vscode.Position(lineNumber, line.text.indexOf("//")),
                    new vscode.Position(lineNumber, line.text.length)
                )
            );

            continue;
        }

        if (line.text.includes("/*")) {
            if (line.text.includes("*/", line.text.indexOf("/*"))) {
                commentRanges.push(
                    new vscode.Range(
                        new vscode.Position(lineNumber, line.text.indexOf("/*")),
                        new vscode.Position(lineNumber, line.text.indexOf("*/", line.text.indexOf("/*")))
                    )
                );
            } else {
                activeComment = new vscode.Position(lineNumber, line.text.indexOf("/*"));

                continue;
            }
        }
    }

    return commentRanges;
}

async function isCommented(commentRanges: vscode.Range[], position: vscode.Position): Promise<boolean> {
    for (const commentRange of commentRanges) {
        if (commentRange.contains(position)) {
            return true;
        }
    }

    return false;
}

export async function findContextByPosition(
    document: vscode.TextDocument,
    position: vscode.Position
): Promise<ZScriptContext | null | undefined> {
    const commentRanges: vscode.Range[] = await parseComments(document);
    const contextes: ZScriptContext[] = (await parseContextes(document)).contextes;
    let contextFound: ZScriptContext | null | undefined = null;

    for (const range of commentRanges) {
        if (range.contains(position)) {
            return undefined;
        }
    }

    orderContextArray(contextes);

    // Contextes, if needed, is not gonna be modified if I use it like that
    for (const context of [...contextes].reverse()) {
        if (context.contains(position)) {
            contextFound = context;
        }
    }

    return contextFound;
}
