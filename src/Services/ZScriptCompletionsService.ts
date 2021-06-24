import * as vscode from "vscode";
import { defaultCompletions } from "../BuiltIn/completions";
import ContextData from "../Interfaces/ContextData";
import ZScriptDocumentService from "./ZScriptDocumentService";
import ZScriptVariablesService from "./ZScriptVariablesService";

export default class ZScriptCompletionService {
    public static DOCUMENT_START = new vscode.Position(0, 0);

    static defaultCompletionProvider: vscode.Disposable = vscode.languages.registerCompletionItemProvider("zscript", {
        async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            if (ZScriptDocumentService.positionInComment(document, position)) {
                return null;
            }

            const contextData: ContextData | null = ZScriptDocumentService.positionContextData(document, position);

            let globalContextText = document.getText(new vscode.Range(ZScriptCompletionService.DOCUMENT_START, position));
            let completions: vscode.CompletionItem[] = [];

            if (contextData) {
                globalContextText = globalContextText.concat(document.getText(new vscode.Range(position, document.positionAt(contextData.closing))));
            }

            completions.push(...await ZScriptCompletionService.getContextTextVariables(globalContextText));

            if (contextData) {
                const contextText = document.getText(new vscode.Range(document.positionAt(contextData.opening + 1), position)).trim();

                completions.push(...await ZScriptCompletionService.getContextTextVariables(contextText));
            }

            return [...defaultCompletions, ...completions];
        }
    });

    static async getContextTextVariables(contextText: string): Promise<vscode.CompletionItem[]> {
        const cleanedTextPieces = ZScriptDocumentService.getCleanText(contextText)
            .split(/;|\{\}/gmi)
            .map(textPiece => textPiece.replace(/(\r)??\n/gmi, '').trim())
            .filter(textPiece => textPiece && (!textPiece.startsWith("version") && !textPiece.startsWith("#include")));

        const cleanedPromises: Promise<vscode.CompletionItem>[] = [];

        for (const cleanedTextPiece of cleanedTextPieces) {
            cleanedPromises.push(ZScriptVariablesService.treatVariableLine(cleanedTextPiece));
        }

        return Promise.all(cleanedPromises);
    }
}