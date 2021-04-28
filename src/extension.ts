"use strict";
import * as vscode from "vscode";
import ZScriptContext from "./classes/ZScriptContext";
import ZScriptError from "./classes/ZScriptError";
import ZScriptContextType from "./enums/ZScriptContextType";
import ZScriptCompletionItem from "./classes/ZScriptCompletionItem";
import * as builtInCompletions from "./builtIn/completions";

let majorContextes: Array<ZScriptContext> = [];
let errorRanges: Array<ZScriptError> = [];
let documentLineCount: number = 0;

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
        provideCompletionItems(
            _document: vscode.TextDocument,
            position: vscode.Position,
            _token: vscode.CancellationToken,
            _context: vscode.CompletionContext
        ) {
            let callContext: ZScriptContext | null = null;

            for (const context of majorContextes) {
                if (context.contains(position)) {
                    callContext = context;
                    
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
    const commentChanges: Array<vscode.Position> = [];
    const tempContextes: Array<ZScriptContext> = [];
    const commentRanges: Set<vscode.Range> = new Set();
    errorRanges = [];

    /**
     * Checks if the context given has been commented
     * @param positionToCheck  The context to check
     * @returns {boolean}
     */
    function hasBeenCommented(positionToCheck: vscode.Position, commentChangesCheck: boolean = true): boolean {
        if (commentChangesCheck && commentChanges.length > 0) {
            return true;
        }

        if (commentRanges.size > 0) {
            for (const commentRange of commentRanges) {
                if (commentRange.contains(positionToCheck)) {
                    return true;
                }
            }
        }

        return false;
    }

    for (let i = 0; i < document.lineCount; i++) {
        const line: vscode.TextLine = document.lineAt(i);
        const lineNumber: number = line.lineNumber;
        const lineText: string = line.text;

        if (lineText.includes("//")) {
            commentRanges.add(
                new vscode.Range(
                    new vscode.Position(lineNumber, lineText.indexOf("//") + 1),
                    new vscode.Position(lineNumber, line.range.end.character)
                )
            );
        }

        if (lineText.includes("/*")) {
            const newCommentChange: vscode.Position = new vscode.Position(lineNumber, lineText.indexOf("/*") + 1);

            if (!hasBeenCommented(newCommentChange)) {
                commentChanges.push(newCommentChange);
            }
        }

        if (lineText.includes("*/")) {
            const newCommentChange: vscode.Position = new vscode.Position(lineNumber, lineText.indexOf("*/"));

            if (!hasBeenCommented(newCommentChange, false)) {
                commentChanges.push(newCommentChange);

                try {
                    if (!lineText.includes("/*") && lineText.indexOf("/*") < lineText.indexOf("*/")) {
                        commentRanges.add(
                            new vscode.Range(
                                commentChanges.splice(commentChanges.length - 2, 1)[0],
                                commentChanges.splice(commentChanges.length - 1, 1)[0]
                            )
                        );
                    } else {
                        commentRanges.add(
                            new vscode.Range(
                                commentChanges.splice(commentChanges.length - 1, 1)[0],
                                commentChanges.splice(commentChanges.length - 2, 1)[0]
                            )
                        );
                    }
                } catch (error) {
                    errorRanges.push(
                        new ZScriptError(
                            new vscode.Position(newCommentChange.line, newCommentChange.character),
                            new vscode.Position(newCommentChange.line, newCommentChange.character),
                            '"/*" expected somewhere!'
                        )
                    );
                }
            }
        }

        if (lineText.includes("{")) {
            const newContextChange: vscode.Position = new vscode.Position(lineNumber, lineText.indexOf("{") + 1);

            if (!hasBeenCommented(newContextChange)) {
                contextChanges.push(newContextChange);
            }
        }

        if (lineText.includes("}")) {
            const newContextChange: vscode.Position = new vscode.Position(lineNumber, lineText.indexOf("}"));

            if (!hasBeenCommented(newContextChange)) {
                contextChanges.push(newContextChange);

                try {
                    if (!lineText.includes("{") && lineText.indexOf("{") < lineText.indexOf("}")) {
                        tempContextes.push(
                            new ZScriptContext(
                                contextChanges.splice(contextChanges.length - 2, 1)[0],
                                contextChanges.splice(contextChanges.length - 1, 1)[0],
                                ZScriptContextType.Unknown
                            )
                        );
                    } else {
                        tempContextes.push(
                            new ZScriptContext(
                                contextChanges.splice(contextChanges.length - 1, 1)[0],
                                contextChanges.splice(contextChanges.length - 2, 1)[0],
                                ZScriptContextType.Unknown
                            )
                        );
                    }
                } catch (error) {
                    errorRanges.push(
                        new ZScriptError(
                            new vscode.Position(newContextChange.line, newContextChange.character),
                            new vscode.Position(newContextChange.line, newContextChange.character),
                            '"{" expected somewhere!'
                        )
                    );
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

    if (document.lineCount !== documentLineCount || tempContextes !== majorContextes) {
        documentLineCount = document.lineCount;
        majorContextes = tempContextes.filter((contextWithOutherContext) => !contextWithOutherContext.outherContext);
    }

    if (contextChanges.length > 0) {
        for (const change of contextChanges) {
            errorRanges.push(
                new ZScriptError(
                    new vscode.Position(change.line, change.character),
                    new vscode.Position(change.line, change.character),
                    '"}" expected somewhere!'
                )
            );
        }
    }
}
