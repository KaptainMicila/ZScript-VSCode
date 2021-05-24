"use strict";
import * as vscode from "vscode";
import ZScriptContext from "./Classes/ZScriptContext";
import ZScriptError from "./Classes/ZScriptError";
import { ContextType } from "./BuiltIn/enums";
import * as builtInTypes from "./BuiltIn/types";
import { globalScopeValues } from "./BuiltIn/completions";
import * as ZScriptContextService from "./Services/ZScriptContextService";
import * as ZScriptErrorService from "./Services/ZScriptErrorService";
import * as ZscriptCompletionService from "./Services/ZScriptCompletionsService";

let majorContextes: ZScriptContext[] = [];
let errorRanges: ZScriptError[] = [];
let usermadeCompletions: builtInTypes.ZScriptType[] = [];

export async function activate(context: vscode.ExtensionContext) {
    const { activeTextEditor } = vscode.window;

    if (!activeTextEditor) {
        return;
    }

    const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
    const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
        async provideCompletionItems(_document: vscode.TextDocument, position: vscode.Position) {
            const callContext: ZScriptContext | null = await ZScriptContextService.findContextByPosition(
                position,
                majorContextes
            );

            const usermadeCompletionsList: vscode.CompletionItem[] =
                await ZscriptCompletionService.generateCompletionsFromObjects(usermadeCompletions);

            if (callContext === null) {
                return [
                    ...globalScopeValues,
                    ...(await ZscriptCompletionService.generateCompletionsFromObjects(
                        usermadeCompletions.filter((completition) => !completition.context?.outherContext)
                    )),
                ];
            }

            if (callContext.type === ContextType.Enum) {
                return null;
            }

            return [...usermadeCompletionsList];
        },
    });

    ZScriptContextService.updateTextContextes(
        activeTextEditor.document,
        errorRanges,
        usermadeCompletions,
        majorContextes
    );

    ZScriptErrorService.updateDiagnostics(activeTextEditor.document, contextErrorsCollection, errorRanges);

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(async (event) => {
            majorContextes = [];
            errorRanges = [];
            usermadeCompletions = [];
            ZScriptContextService.updateTextContextes(event.document, errorRanges, usermadeCompletions, majorContextes);
            ZScriptErrorService.updateDiagnostics(event.document, contextErrorsCollection, errorRanges);
        }),
        completitionProvider,
        contextErrorsCollection
    );
}
