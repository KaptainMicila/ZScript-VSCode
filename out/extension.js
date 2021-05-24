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
const enums_1 = require("./BuiltIn/enums");
const completions_1 = require("./BuiltIn/completions");
const ZScriptContextService = require("./Services/ZScriptContextService");
const ZScriptErrorService = require("./Services/ZScriptErrorService");
const ZscriptCompletionService = require("./Services/ZScriptCompletionsService");
let majorContextes = [];
let errorRanges = [];
let usermadeCompletions = [];
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
        const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
            provideCompletionItems(_document, position) {
                return __awaiter(this, void 0, void 0, function* () {
                    const callContext = yield ZScriptContextService.findContextByPosition(position, majorContextes);
                    const usermadeCompletionsList = yield ZscriptCompletionService.generateCompletionsFromObjects(usermadeCompletions);
                    if (callContext === null) {
                        return [
                            ...completions_1.globalScopeValues,
                            ...(yield ZscriptCompletionService.generateCompletionsFromObjects(usermadeCompletions.filter((completition) => { var _a; return !((_a = completition.context) === null || _a === void 0 ? void 0 : _a.outherContext); }))),
                        ];
                    }
                    if (callContext.type === enums_1.ContextType.Enum) {
                        return null;
                    }
                    return [...usermadeCompletionsList];
                });
            },
        });
        ZScriptContextService.updateTextContextes(activeTextEditor.document, errorRanges, usermadeCompletions, majorContextes);
        ZScriptErrorService.updateDiagnostics(activeTextEditor.document, contextErrorsCollection, errorRanges);
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => __awaiter(this, void 0, void 0, function* () {
            majorContextes = [];
            errorRanges = [];
            usermadeCompletions = [];
            ZScriptContextService.updateTextContextes(event.document, errorRanges, usermadeCompletions, majorContextes);
            ZScriptErrorService.updateDiagnostics(event.document, contextErrorsCollection, errorRanges);
        })), completitionProvider, contextErrorsCollection);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map