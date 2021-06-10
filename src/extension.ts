import * as vscode from "vscode";
import ZScriptCompletionsService from "./Services/ZScriptCompletionsService";

export function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completionProvider = ZScriptCompletionsService.defaultCompletionProvider;

    context.subscriptions.push(
        completionProvider,
        contextErrorsCollection
    );
}
