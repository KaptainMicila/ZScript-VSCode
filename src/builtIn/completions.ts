import * as vscode from "vscode";
import * as completionTypes from "./types";
import * as ZScriptCompletionService from "../Services/ZScriptCompletionsService";

// DEFAULT COMPLETIONS
// Always avaible

export const defaultCompletions: vscode.CompletionItem[] = [];

for (const completionText of ["class", "enum", "struct", "const", "mixin", "null", "void", "voidptr"]) {
    const completitionType = new vscode.CompletionItem(completionText, vscode.CompletionItemKind.Keyword);

    defaultCompletions.push(completitionType);
}

// GLOBAL SCOPE COMPLETIONS
// Avaible only in global scope

const version = new vscode.CompletionItem("version", vscode.CompletionItemKind.Keyword);

version.insertText = new vscode.SnippetString('version "${1}";');

const include = new vscode.CompletionItem("include", vscode.CompletionItemKind.Keyword);

include.insertText = new vscode.SnippetString('#include "${1}";');

export const globalScopeValues: vscode.CompletionItem[] = [...defaultCompletions, version, include];

// SCOPED (CURLY) CONTEXT COMPLETITIONS
// When you're inside a context that's not the global one, inside curly brackets.

export const contextAwareCompletitions: vscode.CompletionItem[] = [...defaultCompletions];

ZScriptCompletionService.addTypeToContext(
    [...completionTypes.integers, ...completionTypes.floats],
    contextAwareCompletitions,
    {
        customDetail: "built-in type",
    }
);

ZScriptCompletionService.addTypeToContext(completionTypes.classes, contextAwareCompletitions, {
    customDetail: "built-in class",
    customIcon: vscode.CompletionItemKind.Class,
});

ZScriptCompletionService.addTypeToContext(completionTypes.structs, contextAwareCompletitions, {
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

    contextAwareCompletitions.push(completitionType);
}
