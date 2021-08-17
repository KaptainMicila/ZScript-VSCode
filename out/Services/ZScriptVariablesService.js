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
const vscode = require("vscode");
class ZScriptVariablesService {
    static treatVariableLine(varLine) {
        return __awaiter(this, void 0, void 0, function* () {
            const explodedLine = varLine.split(" ");
            const varCompletion = new vscode.CompletionItem("UNKNOWN");
            let varParameters = [];
            let varVisibility;
            varCompletion.documentation = new vscode.MarkdownString();
            if (['private', 'public'].includes(explodedLine[0].toLowerCase())) {
                varVisibility = explodedLine.splice(0, 1)[0];
            }
            if (explodedLine.includes("class")) {
                varParameters = this.assignCompletionToType("class", varCompletion, explodedLine);
                varCompletion.kind = vscode.CompletionItemKind.Class;
            }
            else if (explodedLine.includes("const")) {
                varParameters = this.assignCompletionToType("const", varCompletion, explodedLine);
                varCompletion.kind = vscode.CompletionItemKind.Constant;
            }
            else if (explodedLine.includes("enum")) {
                varParameters = this.assignCompletionToType("enum", varCompletion, explodedLine);
                varCompletion.kind = vscode.CompletionItemKind.Enum;
            }
            else if (explodedLine.includes("struct")) {
                varParameters = this.assignCompletionToType("struct", varCompletion, explodedLine);
                varCompletion.kind = vscode.CompletionItemKind.Struct;
            }
            else if (explodedLine[1].endsWith(")")) {
                varParameters = this.assignCompletionToType("function", varCompletion, explodedLine, -2);
                varCompletion.kind = vscode.CompletionItemKind.Function;
                varCompletion.insertText = new vscode.SnippetString(varCompletion.label + "(${1})${0}");
            }
            else {
                varParameters = this.assignCompletionToType(explodedLine[0], varCompletion, explodedLine);
                varCompletion.kind = vscode.CompletionItemKind.Variable;
            }
            if (varVisibility) {
                varCompletion.detail = `${varVisibility} ${varCompletion.detail}`;
            }
            return varCompletion;
        });
    }
    static assignCompletionToType(varType, varCompletion, explodedLine, removeChars = 0) {
        varCompletion.detail = varCompletion.detail ? `${varCompletion.detail} ${varType}` : varType;
        const classParameters = explodedLine.splice(0, explodedLine.indexOf(varType));
        if (classParameters.length > 0) {
            varCompletion.detail = `${classParameters.join(" ")} ${varCompletion.detail}`;
        }
        varCompletion.label = explodedLine[1].substr(0, explodedLine[1].length - (-removeChars));
        varCompletion.detail = `${varCompletion.detail} ${varCompletion.label}`;
        return classParameters;
    }
}
exports.default = ZScriptVariablesService;
//# sourceMappingURL=ZScriptVariablesService.js.map