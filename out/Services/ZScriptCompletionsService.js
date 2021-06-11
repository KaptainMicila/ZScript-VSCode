"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const completions_1 = require("../BuiltIn/completions");
const ZScriptDocumentService_1 = require("./ZScriptDocumentService");
class ZScriptCompletionService {
    static scanTextVariables(textToScan) {
        const variables = [];
        const contextComponents = this.getCleanText(textToScan)
            .split(/;|{}/gmi)
            .map(text => text
            .trim()
            .replace(/(\r)??\n/gmi, ''));
        // The last element is usually '', screw it
        contextComponents.pop();
        for (const component of contextComponents) {
            const explodedComponent = component.split(" ");
            let variableVisibility = undefined;
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
    static getCleanText(textToClear) {
        let textToReturn = '';
        let contextesToSkip = 0;
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
exports.default = ZScriptCompletionService;
ZScriptCompletionService.defaultCompletionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
    provideCompletionItems(document, position) {
        const inComment = ZScriptDocumentService_1.default.positionInComment(document, position);
        if (inComment) {
            return null;
        }
        const contextData = ZScriptDocumentService_1.default.positionContextData(document, position);
        if (contextData) {
            console.clear();
            console.log(document.positionAt(contextData.opening), document.positionAt(contextData.closing));
        }
        return [...completions_1.defaultCompletions];
    }
});
//# sourceMappingURL=ZScriptCompletionsService.js.map