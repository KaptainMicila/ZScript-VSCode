import * as vscode from "vscode";
import ZScriptParser from "./Classes/ZScriptParser";
import { ZScriptTokenizer } from "./Classes/ZScriptTokenizer";
import ZScriptErrorService from "./Services/ZScriptErrorService";

export function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const tokenizer = new ZScriptTokenizer(activeTextEditor.document);
    // const parser = new ZScriptParser(activeTextEditor.document);
    const bracketsErrorCollection = vscode.languages.createDiagnosticCollection();

    ZScriptErrorService.searchForUnclosedBrackets(activeTextEditor.document, bracketsErrorCollection),
        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(async (event: vscode.TextDocumentChangeEvent) => {
                console.clear();
                console.table(tokenizer.tokenize());
                // parser.parse(event);
                ZScriptErrorService.searchForUnclosedBrackets(event.document, bracketsErrorCollection);
            }),
            bracketsErrorCollection
        );
}
