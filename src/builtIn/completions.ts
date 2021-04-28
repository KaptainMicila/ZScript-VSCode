import * as vscode from "vscode";
import ZScriptCompletionItem from "../classes/ZScriptCompletionItem";
import * as completionTypes from "../builtIn/types";

interface CompletitionOptions {
    defaultDescription?: vscode.MarkdownString;
    completitionIcon?: vscode.CompletionItemKind;
}

// Helper functions
function addTypeToContext(
    typeFamily: completionTypes.ZScriptType[],
    contextArray: ZScriptCompletionItem[],
    options?: CompletitionOptions
) {
    for (const typeName of typeFamily) {
        const newCompletition = new ZScriptCompletionItem(
            typeName.label,
            options?.completitionIcon ?? vscode.CompletionItemKind.Keyword
        );

        let typeDescription = null;

        if (typeName.description) {
            typeDescription = typeName.description;
            newCompletition.documentation = typeDescription;
        } else if (options && options.defaultDescription) {
            typeDescription = options.defaultDescription;
            newCompletition.documentation = typeDescription;
        }

        contextArray.push(newCompletition);

        if (typeName.aliases) {
            for (const aliasName of typeName.aliases) {
                const newCompletitionAlias = new ZScriptCompletionItem(
                    aliasName,
                    options?.completitionIcon ?? vscode.CompletionItemKind.Keyword
                );

                newCompletitionAlias.detail = typeName.label;

                if (typeDescription) {
                    newCompletitionAlias.documentation = new vscode.MarkdownString(
                        typeDescription.value + `\n\nAlias of \`${typeName.label}\``
                    );
                }

                contextArray.push(newCompletitionAlias);
            }
        }
    }
}

// DEFAULT COMPLETIONS
// Always avaible

export const defaultCompletions: ZScriptCompletionItem[] = [];

for (const completionText of ["class", "enum", "struct", "const", "mixin", "null", "void", "voidptr"]) {
    const completitionType = new ZScriptCompletionItem(completionText, vscode.CompletionItemKind.Keyword);

    defaultCompletions.push(completitionType);
}

// GLOBAL SCOPE COMPLETIONS
// Avaible only in global scope

const version = new ZScriptCompletionItem("version", vscode.CompletionItemKind.Keyword);

version.insertText = new vscode.SnippetString('version "${1}";');

const include = new ZScriptCompletionItem("include", vscode.CompletionItemKind.Keyword);

include.insertText = new vscode.SnippetString('#include "${1}";');

export const globalScopeValues: ZScriptCompletionItem[] = [...defaultCompletions, version, include];

// SCOPED CONTEXT COMPLETITIONS
// When you're inside a context that's not the global one.

export const contextCompletitions: ZScriptCompletionItem[] = [...defaultCompletions];

addTypeToContext(completionTypes.integers, contextCompletitions);
addTypeToContext(completionTypes.floats, contextCompletitions);

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
    const completitionType = new ZScriptCompletionItem(completionText, vscode.CompletionItemKind.Keyword);

    contextCompletitions.push(completitionType);
}
