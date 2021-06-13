"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const completions_1 = require("../BuiltIn/completions");
const ZScriptDocumentService_1 = require("./ZScriptDocumentService");
class ZScriptCompletionService {
    static getContextTextVariables(contextText) {
        console.clear();
        const cleanedText = ZScriptDocumentService_1.default.getCleanText(contextText);
        console.log(cleanedText);
        return [];
    }
}
exports.default = ZScriptCompletionService;
ZScriptCompletionService.DOCUMENT_START = new vscode.Position(0, 0);
ZScriptCompletionService.defaultCompletionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
    provideCompletionItems(document, position) {
        if (ZScriptDocumentService_1.default.positionInComment(document, position)) {
            return null;
        }
        const contextData = ZScriptDocumentService_1.default.positionContextData(document, position);
        let globalContextText = document.getText(new vscode.Range(ZScriptCompletionService.DOCUMENT_START, position));
        let completions = [];
        if (contextData) {
            globalContextText = globalContextText.concat(document.getText(new vscode.Range(position, document.positionAt(contextData.closing))));
        }
        completions.push(...ZScriptCompletionService.getContextTextVariables(globalContextText));
        return [...completions_1.defaultCompletions];
    }
});
//# sourceMappingURL=ZScriptCompletionsService.js.map