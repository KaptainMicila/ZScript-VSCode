"use strict";
import * as vscode from "vscode";
import { defaultCompletions, globalScopeValues } from "./BuiltIn/completions";
import { ContextType } from "./BuiltIn/enums";
import ZScriptContext from "./Classes/ZScriptContext";
import * as ZScriptContextService from "./Services/ZScriptContextService";

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
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

            const contextRegex = contextDefinitionText.match(
                /(?<classModifiers>.+?(?=\s+?class))|(?<classDefinition>class[\s\S]+$)/gim
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

            if (explodedContextDefinition[0] === "enum") {
                return [];
            }

            const contextName = explodedContextDefinition[1];
            const contextCompletion = completions.find((completion) => completion.label === contextName);

            if (contextCompletion) {
                contextCompletion.label = "self";
            }

            console.clear();
            console.log({
                prorieties: contextProprieties,
                text: contextText,
                content: { definition: contextDefinitionText, content: contextContentText },
            });

            return [...defaultCompletions, ...completions];
        },
    });

    ZScriptContextService.verifyDocumentStructure(activeTextEditor.document, contextErrorsCollection);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            ZScriptContextService.verifyDocumentStructure(event.document, contextErrorsCollection);
        }),
        completionProvider,
        contextErrorsCollection
    );
}
