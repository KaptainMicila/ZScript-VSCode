"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const ZScriptCompletionsService_1 = require("./Services/ZScriptCompletionsService");
function activate(context) {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
        return;
    }
    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completionProvider = ZScriptCompletionsService_1.default.defaultCompletionProvider;
    context.subscriptions.push(completionProvider, contextErrorsCollection);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map