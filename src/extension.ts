import * as vscode from "vscode";
import ZScriptErrorService from "./Services/ZScriptErrorService";

export function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) { return; }

    const bracketsErrorCollection = vscode.languages.createDiagnosticCollection();

    ZScriptErrorService.searchForUnclosedBrackets(
        activeTextEditor.document,
        bracketsErrorCollection
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(
            async (event: vscode.TextDocumentChangeEvent) => {
                ZScriptErrorService.searchForUnclosedBrackets(
                    event.document,
                    bracketsErrorCollection
                );
            }),
        bracketsErrorCollection
    );
}
