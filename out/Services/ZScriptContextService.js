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
class ZScriptDocumentService {
    static positionInComment(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const positionOffset = document.offsetAt(position);
            const documentText = document.getText();
            if ((documentText.lastIndexOf("/*", positionOffset) > documentText.lastIndexOf("*/", positionOffset)
                && documentText.indexOf("/*", positionOffset) > documentText.indexOf("*/", positionOffset))
                || documentText.lastIndexOf("*/", positionOffset) === documentText.indexOf("*/", positionOffset)) {
                return true;
            }
            const lineText = document.lineAt(position.line).text;
            if (lineText.includes("//") && lineText.indexOf("//") < position.character) {
                return true;
            }
            return false;
        });
    }
    static positionInContext(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const positionOffset = document.offsetAt(position);
            const documentText = document.getText();
            return false;
        });
    }
}
exports.default = ZScriptDocumentService;
//# sourceMappingURL=ZScriptContextService.js.map