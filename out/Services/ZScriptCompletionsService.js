"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCompletionProvider = void 0;
const vscode = require("vscode");
const completions_1 = require("../BuiltIn/completions");
const ZScriptContextService = require("../Services/ZScriptContextService");
exports.defaultCompletionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
    provideCompletionItems(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const inComment = yield ZScriptContextService.positionInComment(document, position);
            if (inComment) {
                return null;
            }
            return [...completions_1.defaultCompletions];
        });
    }
});
function scanTextVariables(contextTextToScan) {
    return __awaiter(this, void 0, void 0, function* () {
        const variables = [];
        const contextComponents = (yield getCleanText(contextTextToScan))
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
    });
}
function getCleanText(textToClear) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
//# sourceMappingURL=ZScriptCompletionsService.js.map