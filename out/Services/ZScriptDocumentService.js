"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
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
        let searchingPosition = { opening: 0, closing: 0 };
        let contextesToIgnore = 0;
        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex);
            const lineText = line.text;
            for (let characterIndex = 0; characterIndex < lineText.length; characterIndex++) {
                const character = lineText.charAt(characterIndex);
                if (character === '{') {
                    if (searchingPosition.opening === 0) {
                        searchingPosition.opening = document.offsetAt(new vscode.Position(lineIndex, characterIndex));
                    }
                    else {
                        contextesToIgnore++;
                    }
                }
                if (character === "}") {
                    if (searchingPosition.opening > 0) {
                        if (contextesToIgnore === 0) {
                            searchingPosition.closing = document.offsetAt(new vscode.Position(lineIndex, characterIndex));
                            if (searchingPosition.opening < positionOffset && positionOffset < searchingPosition.closing) {
                                return searchingPosition;
                            }
                            searchingPosition.opening = searchingPosition.closing = 0;
                            continue;
                        }
                        contextesToIgnore--;
                    }
                }
            }
        }
        return null;
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