import * as vscode from "vscode";

export async function positionInComment(document: vscode.TextDocument, position: vscode.Position): Promise<boolean> {
    console.clear();
    const positionOffset = document.offsetAt(position);
    const documentText = document.getText();

    function offsetPosition(string: string): number {
        return documentText.indexOf(string, positionOffset);
    }

    function lastOffsetPosition(string: string): number {
        return documentText.lastIndexOf(string, positionOffset);
    }

    if (
        (
            lastOffsetPosition("/*") > lastOffsetPosition("*/")
            && offsetPosition("/*") > offsetPosition("*/")
        )
        || lastOffsetPosition("*/") === offsetPosition("*/")
    ) {
        return true;
    }

    const lineText = document.lineAt(position.line).text;

    if (lineText.includes("//") && lineText.indexOf("//") < position.character) {
        return true;
    }

    return false;
}