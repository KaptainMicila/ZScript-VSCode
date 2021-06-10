"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ZScriptDocumentService {
    static positionInComment(document, position) {
        const positionOffset = document.offsetAt(position);
        const documentText = document.getText();
        if (this.stringOffetComparsion(documentText, positionOffset, "/*", "*/")) {
            return true;
        }
        const lineText = document.lineAt(position.line).text;
        if (lineText.includes("//") && lineText.indexOf("//") < position.character) {
            return true;
        }
        return false;
    }
    static positionContextData(document, position) {
        const documentText = document.getText();
        const positionOffset = document.offsetAt(position);
        if (!this.stringOffetComparsion(documentText, positionOffset, "{", "}")) {
            return null;
        }
        return { opening: documentText.lastIndexOf("{", positionOffset), closing: documentText.indexOf("}", positionOffset) };
    }
    /**
     * @param {string} documentText The document text to check
     * @param {number} positionOffset The position to check if it's inside the range
     * @param {string} opening The string that opens the range
     * @param {string} closing The string that closes the range
     * @returns {boolean}
     */
    static stringOffetComparsion(documentText, positionOffset, opening, closing) {
        const firstIn = documentText.lastIndexOf(opening, positionOffset);
        const firstOut = documentText.lastIndexOf(closing, positionOffset);
        const lastIn = documentText.indexOf(opening, positionOffset);
        const lastOut = documentText.indexOf(closing, positionOffset);
        return (firstIn > -1 && firstIn > firstOut) || (lastIn > -1 && lastIn > lastOut);
    }
}
exports.default = ZScriptDocumentService;
//# sourceMappingURL=ZScriptDocumentService.js.map