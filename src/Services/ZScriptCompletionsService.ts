import * as vscode from "vscode";
import { defaultCompletions } from "../BuiltIn/completions";
import ContextData from "../Interfaces/ContextData";
import ZScriptDocumentService from "./ZScriptDocumentService";

export default class ZScriptCompletionService {
    public static DOCUMENT_START = new vscode.Position(0, 0);

    static defaultCompletionProvider: vscode.Disposable = vscode.languages.registerCompletionItemProvider("zscript", {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            if (ZScriptDocumentService.positionInComment(document, position)) {
                return null;
            }

            const contextData: ContextData | null = ZScriptDocumentService.positionContextData(document, position);

            let globalContextText = document.getText(new vscode.Range(ZScriptCompletionService.DOCUMENT_START, position));
            let completions: vscode.CompletionItem[] = [];

            if (contextData) {
                globalContextText = globalContextText.concat(document.getText(new vscode.Range(position, document.positionAt(contextData.closing))));
            }

            completions.push(...ZScriptCompletionService.getContextTextVariables(globalContextText));

            return [...defaultCompletions];
        }
    });

    static getContextTextVariables(contextText: string): vscode.CompletionItem[] {
        console.clear();

        const cleanedText = ZScriptDocumentService.getCleanText(contextText);

        console.log(cleanedText);

        return [];
    }
}