"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextAwareCompletitions = exports.globalScopeValues = exports.defaultCompletions = void 0;
const vscode = require("vscode");
// DEFAULT COMPLETIONS
// Always avaible
exports.defaultCompletions = [];
for (const completionText of ["class", "enum", "struct", "const", "mixin", "null", "void", "voidptr"]) {
    const completitionType = new vscode.CompletionItem(completionText, vscode.CompletionItemKind.TypeParameter);
    completitionType.detail = "type";
    exports.defaultCompletions.push(completitionType);
}
// GLOBAL SCOPE COMPLETIONS
// Avaible only in global scope
const version = new vscode.CompletionItem("version", vscode.CompletionItemKind.Snippet);
version.insertText = new vscode.SnippetString('version "${1}";');
version.detail = "snippet";
const include = new vscode.CompletionItem("include", vscode.CompletionItemKind.Snippet);
include.insertText = new vscode.SnippetString('#include "${1}";');
include.detail = "snippet";
exports.globalScopeValues = [...exports.defaultCompletions, version, include];
// SCOPED (CURLY) CONTEXT COMPLETITIONS
// When you're inside a context that's not the global one, inside curly brackets.
exports.contextAwareCompletitions = [...exports.defaultCompletions];
// ZScriptCompletionService.addTypeToContext(
//     [...completionTypes.integers, ...completionTypes.floats],
//     contextAwareCompletitions,
//     {
//         customDetail: "built-in type",
//     }
// );
// ZScriptCompletionService.addTypeToContext(completionTypes.classes, contextAwareCompletitions, {
//     customDetail: "built-in class",
//     customIcon: vscode.CompletionItemKind.Class,
// });
// ZScriptCompletionService.addTypeToContext(completionTypes.structs, contextAwareCompletitions, {
//     customDetail: "built-in struct",
//     customIcon: vscode.CompletionItemKind.Struct,
// });
// for (const completionText of [
//     "string",
//     "name",
//     "vector2",
//     "vector3",
//     "bool",
//     "sound",
//     "spriteid",
//     "state",
//     "statelabel",
//     "textureid",
// ]) {
//     const completitionType = new vscode.CompletionItem(completionText, vscode.CompletionItemKind.Keyword);
//     contextAwareCompletitions.push(completitionType);
// }
//# sourceMappingURL=completions.js.map