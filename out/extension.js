"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
// import ZScriptCompletionsService from "./Services/ZScriptCompletionsService";
const ZScriptErrorService_1 = require("./Services/ZScriptErrorService");
function activate(context) {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor) {
        return;
    }
    // const completionProvider = ZScriptCompletionsService.defaultCompletionProvider;
    const bracketsErrorCollection = vscode.languages.createDiagnosticCollection();
    ZScriptErrorService_1.default.searchForUnclosedBrackets(activeTextEditor.document, bracketsErrorCollection),
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(function (event) {
            ZScriptErrorService_1.default.searchForUnclosedBrackets(event.document, bracketsErrorCollection);
        }), 
        // completionProvider,
        bracketsErrorCollection);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map