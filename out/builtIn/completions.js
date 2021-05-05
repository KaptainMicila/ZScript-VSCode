"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextCompletitions = exports.globalScopeValues = exports.defaultCompletions = void 0;
const vscode = require("vscode");
const ZScriptCompletionItem_1 = require("../classes/ZScriptCompletionItem");
const completionTypes = require("../builtIn/types");
// Helper functions
function addTypeToContext(typeFamily, contextArray, options) {
    var _a, _b;
    for (const typeName of typeFamily) {
        const newCompletition = new ZScriptCompletionItem_1.default(typeName.label, (_a = options === null || options === void 0 ? void 0 : options.customIcon) !== null && _a !== void 0 ? _a : vscode.CompletionItemKind.Keyword);
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
                const newCompletitionAlias = new ZScriptCompletionItem_1.default(aliasName, (_b = options === null || options === void 0 ? void 0 : options.customIcon) !== null && _b !== void 0 ? _b : vscode.CompletionItemKind.Keyword);
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
}
// DEFAULT COMPLETIONS
// Always avaible
exports.defaultCompletions = [];
for (const completionText of ["class", "enum", "struct", "const", "mixin", "null", "void", "voidptr"]) {
    const completitionType = new ZScriptCompletionItem_1.default(completionText, vscode.CompletionItemKind.Keyword);
    exports.defaultCompletions.push(completitionType);
}
// GLOBAL SCOPE COMPLETIONS
// Avaible only in global scope
const version = new ZScriptCompletionItem_1.default("version", vscode.CompletionItemKind.Keyword);
version.insertText = new vscode.SnippetString('version "${1}";');
const include = new ZScriptCompletionItem_1.default("include", vscode.CompletionItemKind.Keyword);
include.insertText = new vscode.SnippetString('#include "${1}";');
exports.globalScopeValues = [...exports.defaultCompletions, version, include];
// SCOPED CONTEXT COMPLETITIONS
// When you're inside a context that's not the global one.
exports.contextCompletitions = [...exports.defaultCompletions];
addTypeToContext(completionTypes.integers, exports.contextCompletitions, { customDetail: "built-in type" });
addTypeToContext(completionTypes.floats, exports.contextCompletitions, { customDetail: "built-in type" });
addTypeToContext(completionTypes.classes, exports.contextCompletitions, {
    customDetail: "built-in class",
    customIcon: vscode.CompletionItemKind.Class,
});
addTypeToContext(completionTypes.structs, exports.contextCompletitions, {
    customDetail: "built-in struct",
    customIcon: vscode.CompletionItemKind.Struct,
});
for (const completionText of [
    "string",
    "name",
    "vector2",
    "vector3",
    "bool",
    "sound",
    "spriteid",
    "state",
    "statelabel",
    "textureid",
]) {
    const completitionType = new ZScriptCompletionItem_1.default(completionText, vscode.CompletionItemKind.Keyword);
    exports.contextCompletitions.push(completitionType);
}
//# sourceMappingURL=completions.js.map