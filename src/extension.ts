"use strict";
import * as vscode from "vscode";
import ZScriptContext from "./classes/ZScriptContext";
import ZScriptError from "./classes/ZScriptError";
import ZScriptContextType from "./enums/ZScriptContextType";
import * as builtInTypes from "./builtIn/types";

let majorContextes: ZScriptContext[] = [];
let errorRanges: ZScriptError[] = [];
let usermadeCompletions: builtInTypes.ZScriptType[] = [];

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
        provideCompletionItems(_document: vscode.TextDocument, position: vscode.Position) {
            let callContext: ZScriptContext | null = null;

            async function cycleContextes(contextArray: ZScriptContext[]) {
                for (const context of contextArray) {
                    if (context.contains(position)) {
                        callContext = context;

                        if (context.innerContextes.length > 0) {
                            cycleContextes(context.innerContextes);
                        }

                        break;
                    }
                }
            }

            cycleContextes(majorContextes);

            if (callContext === null) {
                return [];
            }

            return [];
        },
    });

    updateTextContextes(activeTextEditor.document);
    updateDiagnostics(activeTextEditor.document, contextErrorsCollection);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            updateTextContextes(event.document);
            updateDiagnostics(event.document, contextErrorsCollection);
        }),
        completitionProvider,
        contextErrorsCollection
    );
}

async function updateDiagnostics(document: vscode.TextDocument, diagnosticsCollection: vscode.DiagnosticCollection) {
    if (errorRanges.length > 0) {
        const diagnosticsArray: Array<vscode.Diagnostic> = [];

        for (const range of errorRanges) {
            diagnosticsArray.push({
                code: "",
                message: range.description ?? "",
                range: range,
                severity: vscode.DiagnosticSeverity.Error,
                source: "zscript",
            });
        }

        diagnosticsCollection.set(document.uri, diagnosticsArray);
    } else {
        diagnosticsCollection.clear();
    }
}

async function updateTextContextes(document: vscode.TextDocument) {
    const contextChanges: vscode.Position[][] = [[], [], []];
    const tempContextes: ZScriptContext[] = [];
    errorRanges = [];
    usermadeCompletions = [];
    let commented = false;
    let singleLineCommented = false;

    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
        const line: vscode.TextLine = document.lineAt(lineIndex);
        const lineText: string = line.text;

        if (singleLineCommented) {
            singleLineCommented = false;
        }

        for (let characterIndex = 0; characterIndex < lineText.length; characterIndex++) {
            const character = lineText.charAt(characterIndex);

            if (singleLineCommented) {
                continue;
            }

            let bracketType = ZScriptContextType.UnknownCurly;

            if (commented) {
                commented = character !== "*" || lineText.charAt(characterIndex + 1) !== "/";
            } else {
                switch (character) {
                    case "(":
                    case ")":
                        bracketType = ZScriptContextType.UnknownRound;

                        break;
                    case "[":
                    case "]":
                        bracketType = ZScriptContextType.UnknownSquare;

                        break;
                    case "{":
                    case "}":
                        bracketType = ZScriptContextType.UnknownCurly;

                        break;
                }

                switch (character) {
                    case "(":
                    case "[":
                    case "{":
                        contextChanges[bracketType].push(new vscode.Position(lineIndex, characterIndex + 1));

                        break;
                    case ")":
                    case "]":
                    case "}":
                        contextChanges[bracketType].push(new vscode.Position(lineIndex, characterIndex));

                        try {
                            tempContextes.push(
                                new ZScriptContext(
                                    contextChanges[bracketType].splice(contextChanges[bracketType].length - 2, 1)[0],
                                    contextChanges[bracketType].splice(contextChanges[bracketType].length - 1, 1)[0],
                                    bracketType
                                )
                            );
                        } catch (error) {
                            errorRanges.push(
                                new ZScriptError(
                                    new vscode.Position(lineIndex, characterIndex),
                                    new vscode.Position(lineIndex, characterIndex),
                                    `"${["{", "(", "["][bracketType]}" expected somewhere!`
                                )
                            );
                        }

                        break;
                    case "/":
                        switch (lineText.charAt(characterIndex + 1)) {
                            case "*":
                                commented = true;

                                break;
                            case "/":
                                singleLineCommented = true;

                                break;
                        }

                        break;
                }
            }
        }
    }

    let previousContextEndOffset = 0;

    console.clear();
    for (const context of tempContextes) {
        if (context.type === ZScriptContextType.UnknownCurly) {
            const contextStart = document.offsetAt(context.start);
            const contextText = document.getText().slice(previousContextEndOffset, contextStart).trimStart();

            let contextTypeMatch = contextText.match(/\b(?:enum|struct|class)\b(?=.*?\s*?\{)/gim)?.pop();

            switch (contextTypeMatch) {
                case "enum":
                    context.type = ZScriptContextType.Enum;
                    break;
                case "class":
                    context.type = ZScriptContextType.Class;
                    break;
                case "struct":
                    context.type = ZScriptContextType.Struct;
                    break;
            }

            const contextVariable: builtInTypes.ZScriptVariable = {
                label:
                    contextText
                        .match(/(?:(?<=(?:enum|struct|class)\s+?)\w+|(?<=\w+?\s+?)\w+?(?=\s*?\())(?=.*?\s*?\{)/gim)
                        ?.pop() ?? "Unknown",
                type: contextTypeMatch,
            };

            usermadeCompletions.push(contextVariable);

            previousContextEndOffset = document.offsetAt(context.end) + 1;
        }

        for (const otherContext of tempContextes) {
            if (context !== otherContext) {
                if (otherContext.contains(context)) {
                    otherContext.innerContextes.push(context);
                    context.outherContext = otherContext;

                    break;
                }
            }
        }
    }

    majorContextes = tempContextes.filter((contextWithOutherContext) => !contextWithOutherContext.outherContext);

    for (const contextTypeChanges of contextChanges) {
        for (const contextChange of contextTypeChanges) {
            const position = new vscode.Position(contextChange.line, contextChange.character);

            errorRanges.push(
                new ZScriptError(
                    position,
                    position,
                    `"${["}", ")", "]"][contextChanges.indexOf(contextTypeChanges)]}" is missing somewhere!`
                )
            );
        }
    }
}
