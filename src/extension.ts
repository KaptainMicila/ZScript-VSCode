"use strict";
import * as vscode from "vscode";
import ZScriptContext from "./Classes/ZScriptContext";
import * as ZScriptContextService from "./Services/ZScriptContextService";

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const callContext: ZScriptContext | null | undefined = await ZScriptContextService.findContextByPosition(
                document,
                position
            );

            if (callContext === undefined) {
                return null;
            }

            const completionText = document
                .getText()
                .slice(0, callContext ? document.offsetAt(callContext.end) + 1 : document.offsetAt(position))
                .trim();

            let contextTexts = completionText.match(/(?:class|enum|struct)[\s\S]*?(?=\s*?{)/gmi);

            console.clear();
            console.table(contextTexts);

            return [];
        },
    });

    ZScriptContextService.verifyDocumentStructure(activeTextEditor.document, contextErrorsCollection);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            ZScriptContextService.verifyDocumentStructure(event.document, contextErrorsCollection);
        }),
        completitionProvider,
        contextErrorsCollection
    );
}
