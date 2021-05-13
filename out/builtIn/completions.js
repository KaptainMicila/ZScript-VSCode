"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextAwareCompletitions = exports.globalScopeValues = exports.defaultCompletions = void 0;
const vscode = require("vscode");
const completionTypes = require("../builtIn/types");
// Helper functions
function addTypeToContext(typeFamily, contextArray, options) {
    var _a, _b;
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
}
// DEFAULT COMPLETIONS
// Always avaible
exports.defaultCompletions = [];
for (const completionText of ["class", "enum", "struct", "const", "mixin", "null", "void", "voidptr"]) {
    const completitionType = new vscode.CompletionItem(completionText, vscode.CompletionItemKind.Keyword);
    exports.defaultCompletions.push(completitionType);
}
// GLOBAL SCOPE COMPLETIONS
// Avaible only in global scope
const version = new vscode.CompletionItem("version", vscode.CompletionItemKind.Keyword);
version.insertText = new vscode.SnippetString('version "${1}";');
const include = new vscode.CompletionItem("include", vscode.CompletionItemKind.Keyword);
include.insertText = new vscode.SnippetString('#include "${1}";');
exports.globalScopeValues = [...exports.defaultCompletions, version, include];
// SCOPED (CURLY) CONTEXT COMPLETITIONS
// When you're inside a context that's not the global one, inside curly brackets.
exports.contextAwareCompletitions = [...exports.defaultCompletions];
addTypeToContext([...completionTypes.integers, ...completionTypes.floats], exports.contextAwareCompletitions, {
    customDetail: "built-in type",
});
addTypeToContext(completionTypes.classes, exports.contextAwareCompletitions, {
    customDetail: "built-in class",
    customIcon: vscode.CompletionItemKind.Class,
});
addTypeToContext(completionTypes.structs, exports.contextAwareCompletitions, {
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
    const completitionType = new vscode.CompletionItem(completionText, vscode.CompletionItemKind.Keyword);
    exports.contextAwareCompletitions.push(completitionType);
}
//# sourceMappingURL=completions.js.map