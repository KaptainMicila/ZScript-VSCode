"use strict";
import * as vscode from "vscode";
import ZScriptContext from "./classes/ZScriptContext";
import ZScriptError from "./classes/ZScriptError";

let majorContextes: Array<ZScriptContext> = [];
let errorRanges: Array<ZScriptError> = [];
let documentLineCount: number = 0;

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");

    updateTextContextes(activeTextEditor.document);
    updateDiagnostics(activeTextEditor.document, contextErrorsCollection);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            updateTextContextes(event.document);
            updateDiagnostics(event.document, contextErrorsCollection);
        })
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
                source: "",
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

    console.clear();

    for (let i = 0; i < document.lineCount; i++) {
        const line: vscode.TextLine = document.lineAt(i);
        const lineNumber: number = line.lineNumber;
        const lineText: string = line.text;

        if (lineText.includes("{")) {
            if (
                !lineText.includes("//") ||
                (lineText.includes("//") && lineText.indexOf("{") < lineText.indexOf("//"))
            ) {
                const newContextChange: vscode.Position = new vscode.Position(lineNumber, lineText.indexOf("{") + 1);
                contextChanges.push(newContextChange);
            }
        }

        if (lineText.includes("}")) {
            if (
                !lineText.includes("//") ||
                (lineText.includes("//") && lineText.indexOf("}") < lineText.indexOf("//"))
            ) {
                const newContextChange: vscode.Position = new vscode.Position(lineNumber, lineText.indexOf("}"));
                contextChanges.push(newContextChange);

                if (
                    lineText.includes("{") !== lineText.includes("}") &&
                    lineText.indexOf("{") < lineText.indexOf("}")
                ) {
                    try {
                        tempContextes.push(
                            new ZScriptContext(
                                contextChanges.splice(contextChanges.length - 2, 1)[0],
                                contextChanges.splice(contextChanges.length - 1, 1)[0]
                            )
                        );
                    } catch (error) {
                        errorRanges.push(
                            new ZScriptError(
                                new vscode.Position(newContextChange.line, newContextChange.character),
                                new vscode.Position(newContextChange.line, newContextChange.character),
                                '"{" expected somewhere!'
                            )
                        );
                    }
                } else {
                    try {
                        tempContextes.push(
                            new ZScriptContext(
                                contextChanges.splice(contextChanges.length - 1, 1)[0],
                                contextChanges.splice(contextChanges.length - 2, 1)[0]
                            )
                        );
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
            contextChanges.splice(contextChanges.indexOf(change), 1);
        }
    }
}
