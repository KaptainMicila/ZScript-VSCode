import * as vscode from "vscode";
import { defaultCompletions } from "../BuiltIn/completions";
import ZScriptDocumentService from "./ZScriptDocumentService";

export default class ZScriptCompletionService {
    static defaultCompletionProvider: vscode.Disposable = vscode.languages.registerCompletionItemProvider("zscript", {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
            const inComment: boolean = ZScriptDocumentService.positionInComment(document, position);

            if (inComment) {
                return null;
            }

            const contextData: { opening: number, closing: number } | null = ZScriptDocumentService.positionContextData(document, position);

            return [...defaultCompletions];
        }
    });

    static scanTextVariables(contextTextToScan: string): vscode.CompletionItem[] {
        const variables: vscode.CompletionItem[] = [];

        const contextComponents: string[] =
            this.getCleanText(contextTextToScan)
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

    static getCleanText(textToClear: string) {
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
}