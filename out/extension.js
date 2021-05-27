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
const completions_1 = require("./BuiltIn/completions");
// import ZScriptContext from "./Classes/ZScriptContext";
const ZScriptContextService = require("./Services/ZScriptContextService");
// import * as ZScriptErrorService from "./Services/ZScriptErrorService";
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
        const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
            provideCompletionItems(document, position) {
                return __awaiter(this, void 0, void 0, function* () {
                    const callContext = yield ZScriptContextService.findContextByPosition(document, position);
                    if (callContext === undefined) {
                        return null;
                    }
                    else if (callContext === null) {
                        return [...completions_1.globalScopeValues];
                    }
                });
            },
        });
        ZScriptContextService.verifyDocumentStructure(activeTextEditor.document, contextErrorsCollection);
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => __awaiter(this, void 0, void 0, function* () {
            ZScriptContextService.verifyDocumentStructure(event.document, contextErrorsCollection);
        })), completitionProvider, contextErrorsCollection);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map