import * as vscode from "vscode";

export default class ZScriptVariablesService {
    static async treatVariableLine(varLine: string): Promise<vscode.CompletionItem> {
        const explodedLine = varLine.split(" ");
        const varCompletion = new vscode.CompletionItem("UNKNOWN");
        let varParameters: string[] = [];
        let varVisibility: string | undefined;

        varCompletion.documentation = new vscode.MarkdownString();

        if (['private', 'public'].includes(explodedLine[0].toLowerCase())) {
            varVisibility = explodedLine.splice(0, 1)[0];
        }

        if (explodedLine.includes("class")) {
            varParameters = this.assignCompletionToType("class", varCompletion, explodedLine);
            varCompletion.kind = vscode.CompletionItemKind.Class;
        } else if (explodedLine.includes("const")) {
            varParameters = this.assignCompletionToType("const", varCompletion, explodedLine);
            varCompletion.kind = vscode.CompletionItemKind.Constant;
        } else if (explodedLine.includes("enum")) {
            varParameters = this.assignCompletionToType("enum", varCompletion, explodedLine);
            varCompletion.kind = vscode.CompletionItemKind.Enum;
        } else if (explodedLine.includes("struct")) {
            varParameters = this.assignCompletionToType("struct", varCompletion, explodedLine);
            varCompletion.kind = vscode.CompletionItemKind.Struct;
        } else if (explodedLine[1].endsWith(")")) {
            varParameters = this.assignCompletionToType("function", varCompletion, explodedLine, -2);
            varCompletion.kind = vscode.CompletionItemKind.Function;
        } else {
            varParameters = this.assignCompletionToType("variable", varCompletion, explodedLine);
            varCompletion.kind = vscode.CompletionItemKind.Variable;
        }

        if (varVisibility) {
            varCompletion.detail = `${varVisibility} ${varCompletion.detail}`;
        }

        return varCompletion;
    }

    private static assignCompletionToType(varType: string, varCompletion: vscode.CompletionItem, explodedLine: string[], removeChars: number = 0) {
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