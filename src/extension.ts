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

    ZScriptContextService.verifyDocumentStructure(activeTextEditor.document, contextErrorsCollection);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            ZScriptContextService.verifyDocumentStructure(event.document, contextErrorsCollection);
        }),
        completionProvider,
        contextErrorsCollection
    );
}
