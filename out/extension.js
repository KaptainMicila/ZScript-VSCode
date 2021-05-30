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
const ZScriptContextService = require("./Services/ZScriptContextService");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
        const completionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
            provideCompletionItems(document, position) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const callContext = yield ZScriptContextService.findContextByPosition(document, position);
                    if (callContext === undefined) {
                        return null;
                    }
                    const completions = [];
                    const completionText = document
                        .getText()
                        .slice(0, callContext ? document.offsetAt(callContext.end) + 1 : document.offsetAt(position))
                        .trim();
                    let completionTextes = (_a = completionText.match(/(?:class|enum|struct)[\s\S]*?(?=\s*?{)/gim)) !== null && _a !== void 0 ? _a : [];
                    for (const contextText of completionTextes) {
                        const explodedText = contextText.split(" ").map((text) => text.trim());
                        const completion = new vscode.CompletionItem(explodedText[1]);
                        switch (explodedText[0].toLowerCase()) {
                            case "class":
                                completion.kind = vscode.CompletionItemKind.Class;
                                completion.detail = `class ${explodedText[1]}`;
                                if (explodedText[2] === ":") {
                                    if (explodedText[3]) {
                                        completion.documentation = new vscode.MarkdownString();
                                        completion.documentation.appendCodeblock(`extends ${explodedText[3]}`, "zscript");
                                    }
                                }
                                break;
                            case "enum":
                                completion.kind = vscode.CompletionItemKind.Enum;
                                completion.detail = `enum ${explodedText[1]}`;
                                break;
                            case "struct":
                                completion.kind = vscode.CompletionItemKind.Struct;
                                completion.detail = `struct ${explodedText[1]}`;
                                break;
                            default:
                                continue;
                        }
                        completions.push(completion);
                    }
                    if (callContext === null) {
                        return [...completions_1.globalScopeValues, ...completions];
                    }
                    const contextText = document
                        .getText()
                        .slice(document.getText().lastIndexOf("}", document.offsetAt(callContext.start)) + 1, document.offsetAt(callContext.end))
                        .trim();
                    const [contextDefinitionText, contextContentText] = contextText.split("{").map((text) => text.trim());
                    const contextRegex = contextDefinitionText.match(/(?<classModifiers>.+?(?=\s+?class))|(?<classDefinition>class[\s\S]+$)/gim);
                    if (contextRegex) {
                        if (contextRegex.length > 1) {
                            const contextDefinition = contextRegex[1];
                        }
                    }
                    // const explodedContextDefinition = contextDefinitionText.split(" ");
                    // if (explodedContextDefinition[0] === "enum") {
                    //     return [];
                    // }
                    // const contextName = explodedContextDefinition[1];
                    // const contextCompletition = completions.find((completion) => completion.label === contextName);
                    // if (contextCompletition) {
                    //     contextCompletition.label = "self";
                    // }
                    // console.clear();
                    // console.log({
                    //     text: contextText,
                    //     content: { definition: contextDefinitionText, content: contextContentText },
                    // });
                    return [...completions_1.defaultCompletions, ...completions];
                });
            },
        });
        ZScriptContextService.verifyDocumentStructure(activeTextEditor.document, contextErrorsCollection);
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => __awaiter(this, void 0, void 0, function* () {
            ZScriptContextService.verifyDocumentStructure(event.document, contextErrorsCollection);
        })), completionProvider, contextErrorsCollection);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map