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
    const completionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const callContext: ZScriptContext | null | undefined = await ZScriptContextService.findContextByPosition(
                document,
                position
            );

            if (callContext === undefined) {
                return null;
            }

            const completions: vscode.CompletionItem[] = [];

            const completionText = document
                .getText()
                .slice(0, callContext ? document.offsetAt(callContext.end) + 1 : document.offsetAt(position))
                .trim();

            let contextTextes = completionText.match(/(?:class|enum|struct)[\s\S]*?(?=\s*?{)/gim) ?? [];

            for (const contextText of contextTextes) {
                const explodedText = contextText.split(" ").map((text) => text.trim());

                console.log(explodedText);

                const completion = new vscode.CompletionItem(explodedText[1]);

                switch (explodedText[0].toLowerCase()) {
                    case "class":
                        completion.kind = vscode.CompletionItemKind.Class;
                        break;
                    case "enum":
                        completion.kind = vscode.CompletionItemKind.Enum;
                        break;
                    case "struct":
                        completion.kind = vscode.CompletionItemKind.Struct;
                        break;
                }
            }

            return completions;
        },
    });

    ZScriptContextService.verifyDocumentStructure(activeTextEditor.document, contextErrorsCollection);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            ZScriptContextService.verifyDocumentStructure(event.document, contextErrorsCollection);
        }),
        completionProvider,
        contextErrorsCollection
    );
}
