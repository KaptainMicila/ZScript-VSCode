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
const ZScriptErrorService_1 = require("./Services/ZScriptErrorService");
function activate(context) {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
        return;
    }
    const bracketsErrorCollection = vscode.languages.createDiagnosticCollection();
    ZScriptErrorService_1.default.searchForUnclosedBrackets(activeTextEditor.document, bracketsErrorCollection);
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => __awaiter(this, void 0, void 0, function* () {
        ZScriptErrorService_1.default.searchForUnclosedBrackets(event.document, bracketsErrorCollection);
    })), bracketsErrorCollection);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map