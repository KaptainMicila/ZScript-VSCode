import * as vscode from "vscode";
import { defaultCompletions, globalScopeValues } from "../BuiltIn/completions";
import * as completionTypes from "../BuiltIn/types";
import ZScriptContext from "../Classes/ZScriptContext";
import CompletitionOptions from "../Interfaces/CompletionOptionsInterface";
import * as ZScriptContextService from "../Services/ZScriptContextService";

export const defaultCompletionProvider: vscode.Disposable = vscode.languages.registerCompletionItemProvider("zscript", {
    async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const callContext: ZScriptContext | null | undefined = await ZScriptContextService.findContextByPosition(
            document,
            position
        );

        if (callContext === undefined) {
            return null;
        }
        const completions: vscode.CompletionItem[] = [];

        const completionText = document
            .getText()
            .slice(0, callContext ? document.offsetAt(callContext.end) + 1 : document.offsetAt(position))
            .trim();

        completions.push(...await scanTextVariables(completionText));

        return [...defaultCompletions, ...completions];
    }
});

async function scanTextVariables(contextTextToScan: string): Promise<vscode.CompletionItem[]> {
    console.clear();
    const variables: vscode.CompletionItem[] = [];

    const contextComponents: string[] =
        (await getCleanText(contextTextToScan))
            .split(/;|{}/gmi)
            .map(text =>
                text
                    .trim()
                    .replace(/(\r)??\n/gmi, '')
            );

    // The last element is usually '', screw it
    contextComponents.pop();

    for (const component of contextComponents) {
        const explodedComponent = component.split(" ");
        let variableVisibility: string | undefined = undefined;

        // This check 100% helps identifying if the variable's inside a class
        if (['public', 'private'].includes(explodedComponent[0])) {
            variableVisibility = explodedComponent.splice(0, 1)[0];
        }

        // You better start putting 'private' or 'public' on those variables: ""performance boosts""!
        if (variableVisibility === undefined) {
            if (explodedComponent.includes("class")) {
                const classParameters = explodedComponent.splice(0, explodedComponent.indexOf("class"));
                const newVariable = new vscode.CompletionItem(explodedComponent[1], vscode.CompletionItemKind.Class);

                newVariable.documentation = new vscode.MarkdownString("");
                newVariable.detail = `${explodedComponent[0]} ${explodedComponent[1]}`;

                if (explodedComponent.length > 2 && explodedComponent[2] === ':') {
                    newVariable.documentation.appendCodeblock(`@extends ${explodedComponent[3]}`);
                }

                if (classParameters.length > 0) {
                    newVariable.detail = `${classParameters.join(" ")} ${newVariable.detail}`;

                    for (const classParameter of classParameters) {
                        newVariable.documentation.appendCodeblock(`@${classParameter.toLowerCase()}`);
                    }
                }

                variables.push(newVariable);
            }
        }
    }

    return variables;
}

async function getCleanText(textToClear: string) {
    let textToReturn: string = '';
    let contextesToSkip: number = 0;

    for (let charIndex = 0; charIndex < textToClear.length; charIndex++) {
        const charAtIndex = textToClear.charAt(charIndex);

        if (charAtIndex === "{") {
            if (contextesToSkip < 1) {
                textToReturn += charAtIndex;
            }

            contextesToSkip++;

            continue;
        }

        if (charAtIndex === "}") {
            contextesToSkip--;
        }

        if (contextesToSkip < 1) {
            textToReturn += charAtIndex;
        }
    }

    return textToReturn;
}

// export async function addTypeToContext(
//     typeFamily: completionTypes.ZScriptType[],
//     contextArray: vscode.CompletionItem[],
//     options?: CompletitionOptions
// ) {
//     for (const typeName of typeFamily) {
//         const newCompletition = new vscode.CompletionItem(
//             typeName.label,
//             options?.customIcon ?? vscode.CompletionItemKind.Keyword
//         );

//         let typeDescription = null;

//         if (typeName.description) {
//             typeDescription = typeName.description;
//             newCompletition.documentation = typeDescription;
//         } else if (options && options.defaultDescription) {
//             typeDescription = options.defaultDescription;
//             newCompletition.documentation = typeDescription;
//         }

//         if (options && options.customDetail) {
//             newCompletition.detail = options.customDetail;
//         }

//         contextArray.push(newCompletition);

//         if (typeName.aliases) {
//             for (const aliasName of typeName.aliases) {
//                 const newCompletitionAlias = new vscode.CompletionItem(
//                     aliasName,
//                     options?.customIcon ?? vscode.CompletionItemKind.Keyword
//                 );

//                 if (options && !options.customDetail) {
//                     newCompletitionAlias.detail = typeName.label;
//                 }

//                 if (typeDescription) {
//                     newCompletitionAlias.documentation = new vscode.MarkdownString(
//                         typeDescription.value + `\n\nAlias of \`${typeName.label}\``
//                     );
//                 }

//                 contextArray.push(newCompletitionAlias);
//             }
//         }
//     }
// }