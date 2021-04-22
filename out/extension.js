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
exports.activate = void 0;
const vscode = require("vscode");
const ZScriptContext_1 = require("./classes/ZScriptContext");
const ZScriptError_1 = require("./classes/ZScriptError");
const ZScriptContextType_1 = require("./enums/ZScriptContextType");
let majorContextes = [];
let errorRanges = [];
let documentLineCount = 0;
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
        updateTextContextes(activeTextEditor.document);
        updateDiagnostics(activeTextEditor.document, contextErrorsCollection);
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => __awaiter(this, void 0, void 0, function* () {
            updateTextContextes(event.document);
            updateDiagnostics(event.document, contextErrorsCollection);
        })));
    });
}
exports.activate = activate;
function updateDiagnostics(document, diagnosticsCollection) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (errorRanges.length > 0) {
            const diagnosticsArray = [];
            for (const range of errorRanges) {
                diagnosticsArray.push({
                    code: "",
                    message: (_a = range.description) !== null && _a !== void 0 ? _a : "",
                    range: range,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: "",
                });
            }
            diagnosticsCollection.set(document.uri, diagnosticsArray);
        }
        else {
            diagnosticsCollection.clear();
        }
    });
}
function updateTextContextes(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const contextChanges = [];
        const commentChanges = [];
        const tempContextes = [];
        const commentRanges = new Set();
        errorRanges = [];
        /**
         * Checks if the context given has been commented
         * @param positionToCheck  The context to check
         * @returns {boolean}
         */
        function hasBeenCommented(positionToCheck, commentChangesCheck = true) {
            if (commentChangesCheck && commentChanges.length > 0) {
                return true;
            }
            if (commentRanges.size > 0) {
                for (const commentRange of commentRanges) {
                    if (commentRange.contains(positionToCheck)) {
                        return true;
                    }
                }
            }
            return false;
        }
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const lineNumber = line.lineNumber;
            const lineText = line.text;
            if (lineText.includes("//")) {
                commentRanges.add(new vscode.Range(new vscode.Position(lineNumber, lineText.indexOf("//") + 1), new vscode.Position(lineNumber, line.range.end.character)));
            }
            if (lineText.includes("/*")) {
                const newCommentChange = new vscode.Position(lineNumber, lineText.indexOf("/*") + 1);
                if (!hasBeenCommented(newCommentChange)) {
                    commentChanges.push(newCommentChange);
                }
            }
            if (lineText.includes("*/")) {
                const newCommentChange = new vscode.Position(lineNumber, lineText.indexOf("*/"));
                if (!hasBeenCommented(newCommentChange, false)) {
                    commentChanges.push(newCommentChange);
                    try {
                        if (!lineText.includes("/*") && lineText.indexOf("/*") < lineText.indexOf("*/")) {
                            commentRanges.add(new vscode.Range(commentChanges.splice(commentChanges.length - 2, 1)[0], commentChanges.splice(commentChanges.length - 1, 1)[0]));
                        }
                        else {
                            commentRanges.add(new vscode.Range(commentChanges.splice(commentChanges.length - 1, 1)[0], commentChanges.splice(commentChanges.length - 2, 1)[0]));
                        }
                    }
                    catch (error) {
                        errorRanges.push(new ZScriptError_1.default(new vscode.Position(newCommentChange.line, newCommentChange.character), new vscode.Position(newCommentChange.line, newCommentChange.character), '"/*" expected somewhere!'));
                    }
                }
            }
            if (lineText.includes("{")) {
                const newContextChange = new vscode.Position(lineNumber, lineText.indexOf("{") + 1);
                if (!hasBeenCommented(newContextChange)) {
                    contextChanges.push(newContextChange);
                }
            }
            if (lineText.includes("}")) {
                const newContextChange = new vscode.Position(lineNumber, lineText.indexOf("}"));
                if (!hasBeenCommented(newContextChange)) {
                    contextChanges.push(newContextChange);
                    try {
                        if (!lineText.includes("{") && lineText.indexOf("{") < lineText.indexOf("}")) {
                            tempContextes.push(new ZScriptContext_1.default(contextChanges.splice(contextChanges.length - 2, 1)[0], contextChanges.splice(contextChanges.length - 1, 1)[0], ZScriptContextType_1.ZScriptContextType.Unknown));
                        }
                        else {
                            tempContextes.push(new ZScriptContext_1.default(contextChanges.splice(contextChanges.length - 1, 1)[0], contextChanges.splice(contextChanges.length - 2, 1)[0], ZScriptContextType_1.ZScriptContextType.Unknown));
                        }
                    }
                    catch (error) {
                        errorRanges.push(new ZScriptError_1.default(new vscode.Position(newContextChange.line, newContextChange.character), new vscode.Position(newContextChange.line, newContextChange.character), '"{" expected somewhere!'));
                    }
                }
            }
        }
        for (const context of tempContextes) {
            for (const otherContext of tempContextes) {
                if (context !== otherContext) {
                    if (otherContext.contains(context)) {
                        otherContext.innerContextes.push(context);
                        context.outherContext = otherContext;
                        break;
                    }
                }
            }
        }
        if (document.lineCount !== documentLineCount || tempContextes !== majorContextes) {
            documentLineCount = document.lineCount;
            majorContextes = tempContextes.filter((contextWithOutherContext) => !contextWithOutherContext.outherContext);
        }
        if (contextChanges.length > 0) {
            for (const change of contextChanges) {
                errorRanges.push(new ZScriptError_1.default(new vscode.Position(change.line, change.character), new vscode.Position(change.line, change.character), '"}" expected somewhere!'));
            }
        }
    });
}
//# sourceMappingURL=extension.js.map