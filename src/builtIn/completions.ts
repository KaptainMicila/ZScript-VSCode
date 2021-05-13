import * as vscode from "vscode";
import * as completionTypes from "../builtIn/types";

interface CompletitionOptions {
    defaultDescription?: vscode.MarkdownString;
    customIcon?: vscode.CompletionItemKind;
    customDetail?: string;
}

// Helper functions
function addTypeToContext(
    typeFamily: completionTypes.ZScriptType[],
    contextArray: vscode.CompletionItem[],
    options?: CompletitionOptions
) {
    for (const typeName of typeFamily) {
        const newCompletition = new vscode.CompletionItem(
            typeName.label,
            options?.customIcon ?? vscode.CompletionItemKind.Keyword
        );

        let typeDescription = null;

        if (typeName.description) {
            typeDescription = typeName.description;
            newCompletition.documentation = typeDescription;
        } else if (options && options.defaultDescription) {
            typeDescription = options.defaultDescription;
            newCompletition.documentation = typeDescription;
        }

        if (options && options.customDetail) {
            newCompletition.detail = options.customDetail;
        }

        contextArray.push(newCompletition);

        if (typeName.aliases) {
            for (const aliasName of typeName.aliases) {
                const newCompletitionAlias = new vscode.CompletionItem(
                    aliasName,
                    options?.customIcon ?? vscode.CompletionItemKind.Keyword
                );

                if (options && !options.customDetail) {
                    newCompletitionAlias.detail = typeName.label;
                }

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

addTypeToContext([...completionTypes.integers, ...completionTypes.floats], contextAwareCompletitions, {
    customDetail: "built-in type",
});

addTypeToContext(completionTypes.classes, contextAwareCompletitions, {
    customDetail: "built-in class",
    customIcon: vscode.CompletionItemKind.Class,
});

addTypeToContext(completionTypes.structs, contextAwareCompletitions, {
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