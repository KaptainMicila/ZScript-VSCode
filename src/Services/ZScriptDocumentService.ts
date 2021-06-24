import * as vscode from "vscode";
import ContextData from "../Interfaces/ContextData";

export default class ZScriptDocumentService {
    static positionInComment(document: vscode.TextDocument, position: vscode.Position): boolean {
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

    static positionContextData(document: vscode.TextDocument, position: vscode.Position): ContextData | null {
        const documentText: string = document.getText();
        const positionOffset: number = document.offsetAt(position);
        const bracketsBuffer: number[] = [];

        for (let charIndex = 0; charIndex < documentText.length; charIndex++) {
            const char = documentText.charAt(charIndex);

            if (char === "{") {
                bracketsBuffer.push(charIndex);
            }

            if (char === "}") {
                const startIndex = bracketsBuffer.pop();

                if (!startIndex) {
                    continue;
                }

                if (bracketsBuffer.length <= 0 && (startIndex < positionOffset && positionOffset <= charIndex)) {
                    return { opening: startIndex, closing: charIndex };
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
    private static stringOffetComparsion(documentText: string, positionOffset: number, opening: string, closing: string): boolean {
        const firstIn = documentText.lastIndexOf(opening, positionOffset);
        const firstOut = documentText.lastIndexOf(closing, positionOffset);
        const lastIn = documentText.indexOf(opening, positionOffset);
        const lastOut = documentText.indexOf(closing, positionOffset);

        return (firstIn > -1 && firstIn > firstOut) || (lastIn > -1 && lastIn > lastOut);
    }

    static getCleanText(textToClean: string): string {
        textToClean = textToClean.replace(/ *?(?:\/\*[\s\S]+?\*\/|\/\/.*?(\r)??\n)/gmi, '').trim();
        let cleanedText: string = '';

        let contextesToClose: number = 0;

        for (let charIndex = 0; charIndex < textToClean.length; charIndex++) {
            const char = textToClean.charAt(charIndex);

            if (char === "{") {
                if (contextesToClose < 1) {
                    cleanedText += char;
                }

                contextesToClose++;
            }

            if (char === "}") {
                contextesToClose--;
            }

            if (contextesToClose < 1) {
                cleanedText += char;
            }
        }

        return cleanedText;
    }
}
