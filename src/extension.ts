import * as vscode from "vscode";
import ZScriptCompletionsService from "./Services/ZScriptCompletionsService";
import ZScriptErrorService from "./Services/ZScriptErrorService";

export function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const completionProvider = ZScriptCompletionsService.defaultCompletionProvider;
    const bracketsErrorCollection = vscode.languages.createDiagnosticCollection();

    ZScriptErrorService.searchForUnclosedBrackets(activeTextEditor.document, bracketsErrorCollection),

        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(function (event: vscode.TextDocumentChangeEvent) {
                ZScriptErrorService.searchForUnclosedBrackets(event.document, bracketsErrorCollection);
            }),
            completionProvider,
            bracketsErrorCollection
        );
}
