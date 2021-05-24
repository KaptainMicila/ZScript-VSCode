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
exports.updateTextContextes = exports.findContextByPosition = exports.orderContextArray = exports.analyzeContextes = void 0;
const enums_1 = require("../BuiltIn/enums");
const ZScriptContext_1 = require("../Classes/ZScriptContext");
const vscode = require("vscode");
const ZScriptError_1 = require("../Classes/ZScriptError");
const ZScriptErrorService = require("./ZScriptErrorService");
function analyzeContextes(document, contextArray, resultArray) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        for (const context of contextArray) {
            if (context.type === enums_1.ContextType.UnknownCurly) {
                const contextStart = document.offsetAt(context.start);
                let documentStart;
                if (context.outherContext) {
                    documentStart = document.offsetAt(context.outherContext.start);
                }
                else {
                    documentStart = document.getText().lastIndexOf("}", contextStart);
                }
                const contextText = document
                    .getText()
                    .slice(documentStart ? documentStart + 1 : 0, contextStart)
                    .trimStart();
                let contextTypeMatch = (_a = contextText.match(/\b(?:enum|struct|class)\b(?=.*?\s*?\{)/gim)) === null || _a === void 0 ? void 0 : _a.pop();
                let contextVariable = {
                    label: (_c = (_b = contextText
                        .match(/(?:(?<=(?:enum|struct|class)\s+?)\w+|(?<=\w+?\s+?)\w+?(?=\s*?\())(?=.*?\s*?\{)/gim)) === null || _b === void 0 ? void 0 : _b.pop()) !== null && _c !== void 0 ? _c : "Unknown",
                };
                switch (contextTypeMatch) {
                    case "enum":
                        context.type = enums_1.ContextType.Enum;
                        contextVariable.type = "enum";
                        break;
                    case "class":
                        contextVariable.extends =
                            (_d = contextText.match(/(?<=:\s*?)\w+?(?=(?:\s+?.+?)??\s*?{)/gim)) === null || _d === void 0 ? void 0 : _d.pop();
                        contextVariable.replaces = (_e = contextText
                            .match(/(?<=replaces\s+?)\w+?(?=(?:\s+?.+?)??\s*?{)/gim)) === null || _e === void 0 ? void 0 : _e.pop();
                        context.type = enums_1.ContextType.Class;
                        contextVariable.type = "class";
                        break;
                    case "struct":
                        context.type = enums_1.ContextType.Struct;
                        contextVariable.type = "struct";
                        break;
                    case undefined:
                        if (!["if", "else", "for", "while", "do", "Unknown"].includes(contextVariable.label)) {
                            context.type = enums_1.ContextType.Function;
                            contextVariable.type = "function";
                        }
                        else {
                            continue;
                        }
                        break;
                }
                contextVariable.context = context;
                resultArray.push(contextVariable);
                if (context.innerContextes.length > 0) {
                    analyzeContextes(document, context.innerContextes, resultArray);
                }
            }
        }
    });
}
exports.analyzeContextes = analyzeContextes;
function orderContextArray(contextArray) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const context of contextArray) {
            for (const otherContext of contextArray) {
                if (context !== otherContext) {
                    if (otherContext.contains(context)) {
                        otherContext.innerContextes.push(context);
                        context.outherContext = otherContext;
                        break;
                    }
                }
            }
        }
    });
}
exports.orderContextArray = orderContextArray;
function findContextByPosition(position, contextArray) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const context of contextArray) {
            if (context.contains(position)) {
                if (context.innerContextes.length > 0) {
                    findContextByPosition(position, context.innerContextes);
                }
                return context;
            }
        }
        return null;
    });
}
exports.findContextByPosition = findContextByPosition;
function updateTextContextes(document, errorRangesArray, completionsArray, contextesArray) {
    return __awaiter(this, void 0, void 0, function* () {
        const contextChanges = [[], [], []];
        const tempContextes = [];
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
                let bracketType = enums_1.ContextType.UnknownCurly;
                if (commented) {
                    commented = character !== "*" || lineText.charAt(characterIndex + 1) !== "/";
                }
                else {
                    switch (character) {
                        case "(":
                        case ")":
                            bracketType = enums_1.ContextType.UnknownRound;
                            break;
                        case "[":
                        case "]":
                            bracketType = enums_1.ContextType.UnknownSquare;
                            break;
                        case "{":
                        case "}":
                            bracketType = enums_1.ContextType.UnknownCurly;
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
                                errorRangesArray.push(new ZScriptError_1.default(new vscode.Position(lineIndex, characterIndex), new vscode.Position(lineIndex, characterIndex), `"${["{", "(", "["][bracketType]}" expected somewhere!`));
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
        orderContextArray(tempContextes);
        contextesArray.push(...tempContextes.filter((contextWithOutherContext) => !contextWithOutherContext.outherContext));
        analyzeContextes(document, contextesArray, completionsArray);
        ZScriptErrorService.tagUnclosedBrackets(contextChanges, errorRangesArray);
    });
}
exports.updateTextContextes = updateTextContextes;
//# sourceMappingURL=ZScriptContextService.js.map