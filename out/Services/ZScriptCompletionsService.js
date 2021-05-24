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
exports.addTypeToContext = exports.generateCompletionsFromObjects = void 0;
const vscode = require("vscode");
function generateCompletionsFromObjects(completitionObjects) {
    return __awaiter(this, void 0, void 0, function* () {
        const completitions = [];
        console.clear();
        console.table(completitionObjects);
        for (const completitionObject of completitionObjects) {
            const completition = new vscode.CompletionItem(completitionObject.label);
            switch (completitionObject.type) {
                case "class":
                    completition.kind = vscode.CompletionItemKind.Class;
                    completition.documentation = new vscode.MarkdownString();
                    if (completitionObject.extends) {
                        completition.documentation.appendMarkdown(`extends \`${completitionObject.extends}\``);
                    }
                    if (completitionObject.replaces) {
                        completition.documentation.appendMarkdown(`replaces \`${completitionObject.extends}\``);
                    }
                    break;
                case "enum":
                    completition.kind = vscode.CompletionItemKind.Enum;
                    break;
                case "struct":
                    completition.kind = vscode.CompletionItemKind.Struct;
                    break;
                case "function":
                    completition.kind = vscode.CompletionItemKind.Function;
                    break;
                case undefined:
                    continue;
            }
            completition.detail = `user-made ${completitionObject.type}`;
            completitions.push(completition);
        }
        return completitions;
    });
}
exports.generateCompletionsFromObjects = generateCompletionsFromObjects;
function addTypeToContext(typeFamily, contextArray, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        for (const typeName of typeFamily) {
            const newCompletition = new vscode.CompletionItem(typeName.label, (_a = options === null || options === void 0 ? void 0 : options.customIcon) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Keyword);
            let typeDescription = null;
            if (typeName.description) {
                typeDescription = typeName.description;
                newCompletition.documentation = typeDescription;
            }
            else if (options && options.defaultDescription) {
                typeDescription = options.defaultDescription;
                newCompletition.documentation = typeDescription;
            }
            if (options && options.customDetail) {
                newCompletition.detail = options.customDetail;
            }
            contextArray.push(newCompletition);
            if (typeName.aliases) {
                for (const aliasName of typeName.aliases) {
                    const newCompletitionAlias = new vscode.CompletionItem(aliasName, (_b = options === null || options === void 0 ? void 0 : options.customIcon) !== null && _b !== void 0 ? _b : vscode.CompletionItemKind.Keyword);
                    if (options && !options.customDetail) {
                        newCompletitionAlias.detail = typeName.label;
                    }
                    if (typeDescription) {
                        newCompletitionAlias.documentation = new vscode.MarkdownString(typeDescription.value + `\n\nAlias of \`${typeName.label}\``);
                    }
                    contextArray.push(newCompletitionAlias);
                }
            }
        }
    });
}
exports.addTypeToContext = addTypeToContext;
//# sourceMappingURL=ZScriptCompletionsService.js.map