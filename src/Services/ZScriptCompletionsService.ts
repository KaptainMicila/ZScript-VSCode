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

    let testText: string = '';
    let contextesToSkip: number = 0;

    for (let charIndex = 0; charIndex < contextTextToScan.length; charIndex++) {
        const charAtIndex = contextTextToScan.charAt(charIndex);

        if (charAtIndex === "{") {
            if (contextesToSkip < 1) {
                testText += charAtIndex;
            }

            contextesToSkip++;

            continue;
        }

        if (charAtIndex === "}") {
            contextesToSkip--;
        }

        if (contextesToSkip < 1) {
            testText += charAtIndex;
        }
    }

    console.log(testText);

    return [];
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