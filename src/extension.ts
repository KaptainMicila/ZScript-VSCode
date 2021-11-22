import * as vscode from "vscode";
import ZScriptErrorService from "./Services/ZScriptErrorService";

export function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) { return; }

    const bracketsErrorCollection = vscode.languages.createDiagnosticCollection();

    async function searchForUnclosedBrackets(document: vscode.TextDocument) {
        ZScriptErrorService.searchForUnclosedBrackets(
            document,
            bracketsErrorCollection
        );
    }

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(async document => searchForUnclosedBrackets(document)),
        vscode.workspace.onDidChangeTextDocument(async event => searchForUnclosedBrackets(event.document)),
        bracketsErrorCollection
    );
}
