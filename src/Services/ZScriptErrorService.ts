import * as vscode from "vscode";
import ZScriptError from "../Classes/ZScriptError";

export default class ZScriptErrorService {
    static updateDiagnostics(
        documentUri: vscode.Uri,
        diagnosticsCollection: vscode.DiagnosticCollection,
        errorRangesArray: ZScriptError[]
    ) {
        if (errorRangesArray.length > 0) {
            const diagnosticsArray: vscode.Diagnostic[] = [];

            for (const range of errorRangesArray) {
                diagnosticsArray.push({
                    message: range.description ?? "",
                    range: range,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: "zscript",
                });
            }

            diagnosticsCollection.set(documentUri, diagnosticsArray);
        } else {
            diagnosticsCollection.clear();
        }
    }

    static searchForUnclosedBrackets(
        document: vscode.TextDocument,
        bracketErrorCollection: vscode.DiagnosticCollection
    ) {
        const documentText: string = document.getText();
        let bracketsBuffer: number[] = [];
        const zscriptErrors: ZScriptError[] = [];

        for (let charIndex = 0; charIndex < documentText.length; charIndex++) {
            const char = documentText.charAt(charIndex);

            if (char === "{") {
                bracketsBuffer.push(charIndex);
            }

            if (char === "}") {
                if (bracketsBuffer.pop() === undefined) {
                    zscriptErrors.push(
                        new ZScriptError(
                            document.positionAt(charIndex),
                            document.positionAt(charIndex),
                            "{ missing somewhere!"
                        )
                    );
                }
            }
        }

        for (const position of bracketsBuffer) {
            zscriptErrors.push(
                new ZScriptError(document.positionAt(position), document.positionAt(position), "} missing somewhere!")
            );
        }

        this.updateDiagnostics(document.uri, bracketErrorCollection, zscriptErrors);
    }
}
