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
exports.tagUnclosedBrackets = exports.updateDiagnostics = void 0;
const vscode = require("vscode");
const ZScriptError_1 = require("../Classes/ZScriptError");
function updateDiagnostics(documentUri, diagnosticsCollection, errorRangesArray) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.updateDiagnostics = updateDiagnostics;
function tagUnclosedBrackets(contextChanges, errorRanges) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const contextTypeChanges of contextChanges) {
            for (const contextChange of contextTypeChanges) {
                const position = new vscode.Position(contextChange.line, contextChange.character);
                errorRanges.push(new ZScriptError_1.default(position, position, `"${["}", ")", "]"][contextChanges.indexOf(contextTypeChanges)]}" is missing somewhere!`));
            }
        }
    });
}
exports.tagUnclosedBrackets = tagUnclosedBrackets;
//# sourceMappingURL=ZScriptErrorService.js.map