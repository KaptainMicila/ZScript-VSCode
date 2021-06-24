"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const completions_1 = require("../BuiltIn/completions");
const ZScriptDocumentService_1 = require("./ZScriptDocumentService");
const ZScriptVariablesService_1 = require("./ZScriptVariablesService");
class ZScriptCompletionService {
    static getContextTextVariables(contextText) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanedTextPieces = ZScriptDocumentService_1.default.getCleanText(contextText)
                .split(/;|\{\}/gmi)
                .map(textPiece => textPiece.replace(/(\r)??\n/gmi, '').trim())
                .filter(textPiece => textPiece && (!textPiece.startsWith("version") && !textPiece.startsWith("#include")));
            const cleanedPromises = [];
            for (const cleanedTextPiece of cleanedTextPieces) {
                cleanedPromises.push(ZScriptVariablesService_1.default.treatVariableLine(cleanedTextPiece));
            }
            return Promise.all(cleanedPromises);
        });
    }
}
exports.default = ZScriptCompletionService;
ZScriptCompletionService.DOCUMENT_START = new vscode.Position(0, 0);
ZScriptCompletionService.defaultCompletionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ZScriptDocumentService_1.default.positionInComment(document, position)) {
                return null;
            }
            const contextData = ZScriptDocumentService_1.default.positionContextData(document, position);
            let globalContextText = document.getText(new vscode.Range(ZScriptCompletionService.DOCUMENT_START, position));
            let completions = [];
            if (contextData) {
                globalContextText = globalContextText.concat(document.getText(new vscode.Range(position, document.positionAt(contextData.closing))));
            }
            completions.push(...yield ZScriptCompletionService.getContextTextVariables(globalContextText));
            if (contextData) {
                const contextText = document.getText(new vscode.Range(document.positionAt(contextData.opening + 1), position)).trim();
                completions.push(...yield ZScriptCompletionService.getContextTextVariables(contextText));
            }
            return [...completions_1.defaultCompletions, ...completions];
        });
    }
});
//# sourceMappingURL=ZScriptCompletionsService.js.map