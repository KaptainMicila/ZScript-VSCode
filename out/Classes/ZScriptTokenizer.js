"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZScriptTokenizer = void 0;
const Timer_1 = require("./Timer");
var TokenType;
(function (TokenType) {
    TokenType["Literal"] = "Literal";
    TokenType["String"] = "String";
    TokenType["LineBreak"] = "LineBreak";
    TokenType["Directive"] = "Directive";
})(TokenType || (TokenType = {}));
class ZScriptTokenizer {
    constructor(document) {
        this._document = document;
    }
    get document() {
        return this._document;
    }
    set document(value) {
        this._document = value;
    }
    /**
     * This function is copy pasted from this guide: https://balit.boxxen.org/lexing/basic/index.html, and fixed
     *
     * @returns An array of Tokens.
     */
    tokenize() {
        const timer = new Timer_1.Timer("tokenizer");
        const input = this.document.getText().trim();
        const out = [];
        let currentPosition = 0;
        function lookaheadString(str) {
            const parts = str.split("");
            console.log(str);
            for (let i = 0; i < parts.length; i++) {
                if (input[currentPosition + i] !== parts[i]) {
                    return false;
                }
            }
            return true;
        }
        function lookahead(match, matchNext) {
            const bucket = [];
            for (;;) {
                const nextIndex = currentPosition + bucket.length;
                const nextToken = input[nextIndex];
                if (!nextToken) {
                    break;
                }
                let originalMatch = match;
                if (matchNext && bucket.length) {
                    originalMatch = matchNext;
                }
                if (originalMatch && !originalMatch.test(nextToken)) {
                    break;
                }
                bucket.push(nextToken);
            }
            return bucket;
        }
        while (currentPosition < input.length) {
            const currentToken = input[currentPosition];
            if (/\s/.test(currentToken)) {
                currentPosition++;
                continue;
            }
            if (currentToken === "'" || currentToken === '"') {
                currentPosition++;
                const bucket = lookahead(/[^'"]/);
                out.push({
                    type: TokenType.String,
                    value: bucket.join(""),
                });
                currentPosition += bucket.length + 1;
                continue;
            }
            if (ZScriptTokenizer.literalRegex.test(currentToken)) {
                const bucket = lookahead(ZScriptTokenizer.literalRegex, ZScriptTokenizer.literalRegexNext);
                out.push({
                    type: TokenType.Literal,
                    value: bucket.join(""),
                });
                currentPosition += bucket.length;
                continue;
            }
            let didMatch = false;
            for (const { key, value } of ZScriptTokenizer.tokenStringMap) {
                if (!lookaheadString(key)) {
                    continue;
                }
                out.push(value);
                currentPosition += key.length;
                didMatch = true;
            }
            if (didMatch) {
                continue;
            }
            timer.stop();
            throw new Error(`Unknown input character: ${currentToken}`);
        }
        timer.stop();
        return out;
    }
}
exports.ZScriptTokenizer = ZScriptTokenizer;
ZScriptTokenizer.tokenStringMap = [
    { key: ";", value: { type: TokenType.LineBreak } },
    { key: "version", value: { type: TokenType.Directive } },
    { key: "#include", value: { type: TokenType.Directive } },
];
ZScriptTokenizer.literalRegex = /[#a-zA-Z]/;
ZScriptTokenizer.literalRegexNext = /[a-zA-Z0-9]/;
//# sourceMappingURL=ZScriptTokenizer.js.map