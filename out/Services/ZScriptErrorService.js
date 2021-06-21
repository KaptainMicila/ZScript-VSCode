"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ZScriptError_1 = require("../Classes/ZScriptError");
class ZScriptErrorService {
    static updateDiagnostics(documentUri, diagnosticsCollection, errorRangesArray) {
        var _a;
        if (errorRangesArray.length > 0) {
            const diagnosticsArray = [];
            for (const range of errorRangesArray) {
                diagnosticsArray.push({
                    message: (_a = range.description) !== null && _a !== void 0 ? _a : "",
                    range: range,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: "zscript",
                });
            }
            diagnosticsCollection.set(documentUri, diagnosticsArray);
        }
        else {
            diagnosticsCollection.clear();
        }
        return diagnosticsCollection;
    }
    static searchForUnclosedBrackets(document) {
        const documentText = document.getText();
        let bracketsBuffer = [];
        for (let charIndex = 0; charIndex < documentText.length; charIndex++) {
            const char = documentText.charAt(charIndex);
            if (char === "{") {
                bracketsBuffer.push(charIndex);
            }
            if (char === "}") {
                bracketsBuffer.pop();
            }
        }
        const bracketErrorCollection = vscode.languages.createDiagnosticCollection("unclosedBrackets");
        if (bracketsBuffer.length > 0) {
            const zscriptErrors = [];
            for (const position of bracketsBuffer) {
                zscriptErrors.push(new ZScriptError_1.default(document.positionAt(position), document.positionAt(position), "Something missing"));
            }
            return this.updateDiagnostics(document.uri, bracketErrorCollection, zscriptErrors);
        }
        return bracketErrorCollection;
    }
}
exports.default = ZScriptErrorService;
//# sourceMappingURL=ZScriptErrorService.js.map