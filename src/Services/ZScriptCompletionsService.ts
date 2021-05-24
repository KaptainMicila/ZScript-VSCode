import * as vscode from "vscode";
import * as completionTypes from "../BuiltIn/types";
import CompletitionOptions from "../Interfaces/CompletionOptionsInterface";

export async function generateCompletionsFromObjects(completitionObjects: completionTypes.ZScriptType[]) {
    const completitions: vscode.CompletionItem[] = [];

    console.clear();
    console.table(completitionObjects);

    for (const completitionObject of completitionObjects) {
        const completition = new vscode.CompletionItem(completitionObject.label);

        switch (completitionObject.type) {
            case "class":
                completition.kind = vscode.CompletionItemKind.Class;
                completition.documentation = new vscode.MarkdownString();

                if ((completitionObject as completionTypes.ZScriptClass).extends) {
                    completition.documentation.appendMarkdown(
                        `extends \`${(completitionObject as completionTypes.ZScriptClass).extends}\``
                    );
                }

                if ((completitionObject as completionTypes.ZScriptClass).replaces) {
                    completition.documentation.appendMarkdown(
                        `replaces \`${(completitionObject as completionTypes.ZScriptClass).extends}\``
                    );
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
}

export async function addTypeToContext(
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
