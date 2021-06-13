import * as vscode from "vscode";

export default class ZScriptVariablesService {
    static async treatVariableLine(varLine: string): Promise<vscode.CompletionItem> {
        const explodedLine = varLine.split(" ");
        const varCompletion = new vscode.CompletionItem("UNKNOWN");
        let varVisbility: string = "public";
        let varParameters: string[] = [];

        varCompletion.documentation = new vscode.MarkdownString();

        if (['private', 'public'].includes(explodedLine[0].toLowerCase())) {
            let varVisbility = explodedLine.splice(0, 1);
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
        } else {
            varParameters = this.assignCompletionToType("variable", varCompletion, explodedLine);
            varCompletion.kind = vscode.CompletionItemKind.Variable;
        }

        return varCompletion;
    }

    private static assignCompletionToType(varType: string, varCompletion: vscode.CompletionItem, explodedLine: string[]) {
        varCompletion.detail = varType;

        const classParameters = explodedLine.splice(0, explodedLine.indexOf(varType));

        if (classParameters.length > 0) {
            varCompletion.detail = `${classParameters.join(" ")} ${varCompletion.detail}`;
        }

        varCompletion.label = explodedLine[1];
        varCompletion.detail = `${varCompletion.detail} ${varCompletion.label}`;

        return classParameters;
    }
}