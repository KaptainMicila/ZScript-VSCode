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
    }
    static searchForUnclosedBrackets(document, bracketErrorCollection) {
        const documentText = document.getText();
        let bracketsBuffer = [];
        const zscriptErrors = [];
        for (let charIndex = 0; charIndex < documentText.length; charIndex++) {
            const char = documentText.charAt(charIndex);
            if (char === "{") {
                bracketsBuffer.push(charIndex);
            }
            if (char === "}") {
                if (bracketsBuffer.pop() === undefined) {
                    zscriptErrors.push(new ZScriptError_1.default(document.positionAt(charIndex), document.positionAt(charIndex), "{ missing somewhere!"));
                }
            }
        }
        for (const position of bracketsBuffer) {
            zscriptErrors.push(new ZScriptError_1.default(document.positionAt(position), document.positionAt(position), "} missing somewhere!"));
        }
        this.updateDiagnostics(document.uri, bracketErrorCollection, zscriptErrors);
    }
}
exports.default = ZScriptErrorService;
//# sourceMappingURL=ZScriptErrorService.js.map