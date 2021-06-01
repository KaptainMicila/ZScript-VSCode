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
        const completionEnd = document.getText().indexOf(";", document.offsetAt(position)) === -1 ? document.offsetAt(position) : document.getText().indexOf(";", document.offsetAt(position));

        const completionText = document
            .getText()
            .slice(0, callContext ? document.offsetAt(callContext.end) + 1 : completionEnd)
            .trim();

        console.clear();
        console.log(completionText);

        let completionTextes = completionText.match(/(?:class|enum|struct)[\s\S]*?(?=\s*?{)/gim) ?? [];

        for (const contextText of completionTextes) {
            const explodedText = contextText.split(" ").map((text) => text.trim());
            const completion = new vscode.CompletionItem(explodedText[1]);

            switch (explodedText[0].toLowerCase()) {
                case "class":
                    completion.kind = vscode.CompletionItemKind.Class;
                    completion.detail = `class ${explodedText[1]}`;

                    if (explodedText[2] === ":") {
                        if (explodedText[3]) {
                            completion.documentation = new vscode.MarkdownString();
                            completion.documentation.appendCodeblock(`extends ${explodedText[3]}`, "zscript");
                        }
                    }

                    break;
                case "enum":
                    completion.kind = vscode.CompletionItemKind.Enum;
                    completion.detail = `enum ${explodedText[1]}`;

                    break;
                case "struct":
                    completion.kind = vscode.CompletionItemKind.Struct;
                    completion.detail = `struct ${explodedText[1]}`;

                    break;
                default:
                    continue;
            }

            completions.push(completion);
        }

        if (callContext === null) {
            return [...globalScopeValues, ...completions];
        }

        const contextText = document
            .getText()
            .slice(
                document.getText().lastIndexOf("}", document.offsetAt(callContext.start)) + 1,
                document.offsetAt(callContext.end)
            )
            .trim();

        const [contextDefinitionText, contextContentText] = contextText.split("{").map((text) => text.trim());

        // I'm not taking Enum, because screw them.
        const contextRegex = contextDefinitionText.match(
            /(?<classModifiers>.+?(?=\s+?class))|(?<classDefinition>(?:class|struct)[\s\S]+$)/gim
        );

        if (!contextRegex) {
            return [];
        }

        const contextProprieties: string[] = [];
        const explodedContextDefinition: string[] = [];

        if (contextRegex.length > 1) {
            contextProprieties.push(...contextRegex[0].split(" "));
            explodedContextDefinition.push(...contextRegex[1].split(" "));
        } else {
            explodedContextDefinition.push(...contextRegex[0].split(" "));
        }

        const contextName = explodedContextDefinition[1];
        const contextCompletion = completions.find((completion) => completion.label === contextName);

        if (contextCompletion) {
            if (explodedContextDefinition[0] === "struct") {
                completions.splice(completions.indexOf(contextCompletion), 1);
            } else {
                contextCompletion.label = "self";
            }
        }

        return [...defaultCompletions, ...completions];
    },
});

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