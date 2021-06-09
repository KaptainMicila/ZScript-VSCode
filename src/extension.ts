"use strict";
import * as vscode from "vscode";
import * as ZScriptContextService from "./Services/ZScriptContextService";
import { defaultCompletionProvider } from "./Services/ZScriptCompletionsService";

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completionProvider = defaultCompletionProvider;

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(
            async function (event) {

            }
        ),
        completionProvider,
        contextErrorsCollection
    );
}
