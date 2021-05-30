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
exports.findContextByPosition = exports.parseComments = exports.parseContextes = exports.verifyDocumentStructure = exports.orderContextArray = void 0;
const ZScriptContext_1 = require("../Classes/ZScriptContext");
const vscode = require("vscode");
const enums_1 = require("../BuiltIn/enums");
const ZScriptError_1 = require("../Classes/ZScriptError");
const ZScriptErrorService = require("./ZScriptErrorService");
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
function verifyDocumentStructure(document, contextErrorsCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        ZScriptErrorService.updateDiagnostics(document.uri, contextErrorsCollection, (yield parseContextes(document)).contextErrors);
    });
}
exports.verifyDocumentStructure = verifyDocumentStructure;
function parseContextes(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const contextChanges = [[], [], []];
        const contextes = [];
        const contextErrors = [];
        const commentRanges = yield parseComments(document);
        for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
            const line = document.lineAt(lineNumber);
            for (let characterIndex = 0; characterIndex < line.text.length; characterIndex++) {
                if (yield isCommented(commentRanges, new vscode.Position(lineNumber, characterIndex))) {
                    continue;
                }
                const character = line.text.charAt(characterIndex);
                let bracketType = enums_1.ContextType.UnknownCurly;
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
                        contextChanges[bracketType].push(new vscode.Position(lineNumber, characterIndex + 1));
                        break;
                    case ")":
                    case "]":
                    case "}":
                        contextChanges[bracketType].push(new vscode.Position(lineNumber, characterIndex));
                        try {
                            contextes.push(new ZScriptContext_1.default(contextChanges[bracketType].splice(contextChanges[bracketType].length - 2, 1)[0], contextChanges[bracketType].splice(contextChanges[bracketType].length - 1, 1)[0], bracketType));
                        }
                        catch (error) {
                            contextErrors.push(new ZScriptError_1.default(new vscode.Position(lineNumber, characterIndex), new vscode.Position(lineNumber, characterIndex), `"${["{", "(", "["][bracketType]}" expected somewhere!`));
                        }
                        break;
                }
            }
        }
        if (contextChanges.length > 0) {
            ZScriptErrorService.tagUnclosedBrackets(contextChanges, contextErrors);
        }
        return { contextes, contextErrors };
    });
}
exports.parseContextes = parseContextes;
function parseComments(document) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentRanges = [];
        let activeComment = null;
        for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
            if (yield isCommented(commentRanges, new vscode.Position(lineNumber, 0))) {
                continue;
            }
            const line = document.lineAt(lineNumber);
            if (activeComment !== null) {
                if (line.text.includes("*/")) {
                    commentRanges.push(new vscode.Range(activeComment, new vscode.Position(lineNumber, line.text.indexOf("*/"))));
                    activeComment = null;
                }
                else {
                    continue;
                }
            }
            if (line.text.includes("//")) {
                commentRanges.push(new vscode.Range(new vscode.Position(lineNumber, line.text.indexOf("//")), new vscode.Position(lineNumber, line.text.length)));
                continue;
            }
            if (line.text.includes("/*")) {
                if (line.text.includes("*/", line.text.indexOf("/*"))) {
                    commentRanges.push(new vscode.Range(new vscode.Position(lineNumber, line.text.indexOf("/*")), new vscode.Position(lineNumber, line.text.indexOf("*/", line.text.indexOf("/*")))));
                }
                else {
                    activeComment = new vscode.Position(lineNumber, line.text.indexOf("/*"));
                    continue;
                }
            }
        }
        return commentRanges;
    });
}
exports.parseComments = parseComments;
function isCommented(commentRanges, position) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const commentRange of commentRanges) {
            if (commentRange.contains(position)) {
                return true;
            }
        }
        return false;
    });
}
function findContextByPosition(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        const commentRanges = yield parseComments(document);
        const { contextes } = yield parseContextes(document);
        let contextFound = null;
        for (const range of commentRanges) {
            if (range.contains(position)) {
                return undefined;
            }
        }
        orderContextArray(contextes);
        // Contextes, if needed, is not gonna be modified if I use it like that
        for (const context of [...contextes].reverse()) {
            if (context.contains(position)) {
                contextFound = context;
            }
        }
        return contextFound;
    });
}
exports.findContextByPosition = findContextByPosition;
//# sourceMappingURL=ZScriptContextService.js.map