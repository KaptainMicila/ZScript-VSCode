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
            const callContext = yield ZScriptContextService.findContextByPosition(document, position);
            if (callContext === undefined) {
                return null;
            }
            const completions = [];
            const completionText = document
                .getText()
                .slice(0, callContext ? document.offsetAt(callContext.end) + 1 : document.offsetAt(position))
                .trim();
            completions.push(...yield scanTextVariables(completionText));
            return [...completions_1.defaultCompletions, ...completions];
        });
    }
});
function scanTextVariables(contextTextToScan) {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        let testText = '';
        let contextesToSkip = 0;
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
    });
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
//# sourceMappingURL=ZScriptCompletionsService.js.map