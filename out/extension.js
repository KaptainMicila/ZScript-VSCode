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
exports.activate = void 0;
const vscode = require("vscode");
const ZScriptContext_1 = require("./classes/ZScriptContext");
const ZScriptError_1 = require("./classes/ZScriptError");
const ZScriptContextType_1 = require("./enums/ZScriptContextType");
const builtInCompletions = require("./builtIn/completions");
let majorContextes = [];
let errorRanges = [];
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const contextErrorsCollection = vscode.languages.createDiagnosticCollection("contextErrors");
        const completitionProvider = vscode.languages.registerCompletionItemProvider("zscript", {
            provideCompletionItems(_document, position) {
                let callContext = null;
                function cycleContextes(contextArray) {
                    return __awaiter(this, void 0, void 0, function* () {
                        for (const context of contextArray) {
                            if (context.contains(position)) {
                                callContext = context;
                                if (context.innerContextes.length > 0) {
                                    cycleContextes(context.innerContextes);
                                }
                                break;
                            }
                        }
                    });
                }
                cycleContextes(majorContextes);
                if (callContext === null) {
                    return builtInCompletions.globalScopeValues;
                }
                return builtInCompletions.contextAwareCompletitions;
            },
        });
        updateTextContextes(activeTextEditor.document);
        updateDiagnostics(activeTextEditor.document, contextErrorsCollection);
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => __awaiter(this, void 0, void 0, function* () {
            updateTextContextes(event.document);
            updateDiagnostics(event.document, contextErrorsCollection);
        })), completitionProvider, contextErrorsCollection);
    });
}
exports.activate = activate;
function updateDiagnostics(document, diagnosticsCollection) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (errorRanges.length > 0) {
            const diagnosticsArray = [];
            for (const range of errorRanges) {
                diagnosticsArray.push({
                    code: "",
                    message: (_a = range.description) !== null && _a !== void 0 ? _a : "",
                    range: range,
                    severity: vscode.DiagnosticSeverity.Error,
                    source: "zscript",
                });
            }
            diagnosticsCollection.set(document.uri, diagnosticsArray);
        }
        else {
            diagnosticsCollection.clear();
        }
    });
}
function updateTextContextes(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const contextChanges = [[], [], []];
        const tempContextes = [];
        errorRanges = [];
        let commented = false;
        let singleLineCommented = false;
        for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
            const line = document.lineAt(lineIndex);
            const lineText = line.text;
            if (singleLineCommented) {
                singleLineCommented = false;
            }
            for (let characterIndex = 0; characterIndex < lineText.length; characterIndex++) {
                const character = lineText.charAt(characterIndex);
                if (singleLineCommented) {
                    continue;
                }
                let bracketType = ZScriptContextType_1.default.UnknownCurly;
                if (commented) {
                    commented = character !== "*" || lineText.charAt(characterIndex + 1) !== "/";
                }
                else {
                    switch (character) {
                        case "(":
                        case ")":
                            bracketType = ZScriptContextType_1.default.UnknownRound;
                            break;
                        case "[":
                        case "]":
                            bracketType = ZScriptContextType_1.default.UnknownSquare;
                            break;
                        case "{":
                        case "}":
                            bracketType = ZScriptContextType_1.default.UnknownCurly;
                            break;
                    }
                    switch (character) {
                        case "(":
                        case "[":
                        case "{":
                            contextChanges[bracketType].push(new vscode.Position(lineIndex, characterIndex + 1));
                            break;
                        case ")":
                        case "]":
                        case "}":
                            contextChanges[bracketType].push(new vscode.Position(lineIndex, characterIndex));
                            try {
                                tempContextes.push(new ZScriptContext_1.default(contextChanges[bracketType].splice(contextChanges[bracketType].length - 2, 1)[0], contextChanges[bracketType].splice(contextChanges[bracketType].length - 1, 1)[0], bracketType));
                            }
                            catch (error) {
                                errorRanges.push(new ZScriptError_1.default(new vscode.Position(lineIndex, characterIndex), new vscode.Position(lineIndex, characterIndex), `"${["{", "(", "["][bracketType]}" expected somewhere!`));
                            }
                            break;
                        case "/":
                            switch (lineText.charAt(characterIndex + 1)) {
                                case "*":
                                    commented = true;
                                    break;
                                case "/":
                                    singleLineCommented = true;
                                    break;
                            }
                            break;
                    }
                }
            }
        }
        for (const context of tempContextes) {
            for (const otherContext of tempContextes) {
                if (context !== otherContext) {
                    if (otherContext.contains(context)) {
                        otherContext.innerContextes.push(context);
                        context.outherContext = otherContext;
                        break;
                    }
                }
            }
        }
        majorContextes = tempContextes.filter((contextWithOutherContext) => !contextWithOutherContext.outherContext);
        for (const contextTypeChanges of contextChanges) {
            for (const contextChange of contextTypeChanges) {
                const position = new vscode.Position(contextChange.line, contextChange.character);
                errorRanges.push(new ZScriptError_1.default(position, position, `"${["}", ")", "]"][contextChanges.indexOf(contextTypeChanges)]}" is missing somewhere!`));
            }
        }
    });
}
//# sourceMappingURL=extension.js.map