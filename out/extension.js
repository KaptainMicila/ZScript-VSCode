"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const ZScriptCompletionsService_1 = require("./Services/ZScriptCompletionsService");
const ZScriptErrorService_1 = require("./Services/ZScriptErrorService");
function activate(context) {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
        return;
    }
    const completionProvider = ZScriptCompletionsService_1.default.defaultCompletionProvider;
    context.subscriptions.push(ZScriptErrorService_1.default.searchForUnclosedBrackets(activeTextEditor.document), vscode.workspace.onDidChangeTextDocument(function (event) {
        ZScriptErrorService_1.default.searchForUnclosedBrackets(event.document);
    }), completionProvider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map