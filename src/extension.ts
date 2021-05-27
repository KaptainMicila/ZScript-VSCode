"use strict";
import * as vscode from "vscode";
import { defaultCompletions, globalScopeValues } from "./BuiltIn/completions";
import ZScriptContext from "./Classes/ZScriptContext";
// import ZScriptContext from "./Classes/ZScriptContext";
import * as ZScriptContextService from "./Services/ZScriptContextService";
// import * as ZScriptErrorService from "./Services/ZScriptErrorService";

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
            } else if (callContext === null) {
                return [...globalScopeValues];
            }
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
