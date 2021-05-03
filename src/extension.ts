"use strict";
import * as vscode from "vscode";
import ZScriptContext from "./classes/ZScriptContext";
import ZScriptError from "./classes/ZScriptError";
import ZScriptContextType from "./enums/ZScriptContextType";
import ZScriptCompletionItem from "./classes/ZScriptCompletionItem";
import * as builtInCompletions from "./builtIn/completions";

let majorContextes: Array<ZScriptContext> = [];
let errorRanges: Array<ZScriptError> = [];

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
        provideCompletionItems(_document: vscode.TextDocument, position: vscode.Position) {
            let callContext: ZScriptContext | null = null;

            for (const majorContext of majorContextes) {
                if (majorContext.contains(position)) {
                    callContext = majorContext;

                    break;
                }
            }

            if (callContext === ZScriptCompletionItem.GLOBAL_SCOPE) {
                return builtInCompletions.globalScopeValues;
            }

            return builtInCompletions.contextCompletitions;
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
    const contextChanges: Array<vscode.Position> = [];
    const tempContextes: Array<ZScriptContext> = [];
    errorRanges = [];
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

            if (commented) {
                commented = character !== "*" || lineText.charAt(characterIndex + 1) !== "/";
            } else {
                switch (character) {
                    case "{":
                        contextChanges.push(new vscode.Position(lineIndex, characterIndex + 1));

                        break;
                    case "}":
                        contextChanges.push(new vscode.Position(lineIndex, characterIndex));

                        try {
                            tempContextes.push(
                                new ZScriptContext(
                                    contextChanges.splice(contextChanges.length - 2, 1)[0],
                                    contextChanges.splice(contextChanges.length - 1, 1)[0],
                                    ZScriptContextType.Unknown
                                )
                            );
                        } catch (error) {
                            errorRanges.push(
                                new ZScriptError(
                                    new vscode.Position(lineIndex, characterIndex),
                                    new vscode.Position(lineIndex, characterIndex),
                                    '"{" expected somewhere!'
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

    for (const context of tempContextes) {
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

    if (contextChanges.length > 0) {
        for (const change of contextChanges) {
            const changePosition = new vscode.Position(change.line, change.character);

            errorRanges.push(new ZScriptError(changePosition, changePosition, '"}" expected somewhere!'));
        }
    }
}
