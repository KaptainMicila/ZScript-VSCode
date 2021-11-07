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
        const documentText = document.getText();
        const bracketsBuffer: number[] = [];
        const zscriptErrors: ZScriptError[] = [];

        for (let charIndex = 0; charIndex < documentText.length; charIndex++) {
            const char = documentText.charAt(charIndex);

            if (char === "{") {
                bracketsBuffer.push(charIndex);
            }

            if (char === "}") {
                // If a "}" is found but there's no "{" before it, an Error is added to the list.
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

        // For each "{" that doesn't have a "}" an Error is added to the list.
        for (const position of bracketsBuffer) {
            zscriptErrors.push(
                new ZScriptError(
                    document.positionAt(position),
                    document.positionAt(position),
                    "} missing somewhere!"
                )
            );
        }

        // Updates the diagnostics once it ends searching for unopened/unclosed contextes.
        this.updateDiagnostics(
            document.uri,
            bracketErrorCollection,
            zscriptErrors
        );
    }
}
