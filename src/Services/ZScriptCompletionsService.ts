import * as vscode from "vscode";
import { defaultCompletions, globalScopeValues } from "../BuiltIn/completions";
import * as completionTypes from "../BuiltIn/types";
import ZScriptContext from "../Classes/ZScriptContext";
import CompletitionOptions from "../Interfaces/CompletionOptionsInterface";
import * as ZScriptContextService from "../Services/ZScriptContextService";

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