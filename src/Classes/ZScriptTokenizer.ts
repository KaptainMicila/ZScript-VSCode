import { TextDocument } from "vscode";
import { Timer } from "./Timer";

enum TokenType {
    Literal = "Literal",
    String = "String",
    LineBreak = "LineBreak",
    Directive = "Directive",
}

interface TokenNode<T extends TokenType> {
    type: T;
}

interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
    value: string;
}

type Token =
    | TokenNode<TokenType.LineBreak>
    | TokenValueNode<TokenType.Literal>
    | TokenValueNode<TokenType.String>
    | TokenNode<TokenType.Directive>;

type TokenStringMapType = {
    key: string;
    value: Token;
};

export class ZScriptTokenizer {
    private _document: TextDocument;

    public get document(): TextDocument {
        return this._document;
    }
    public set document(value: TextDocument) {
        this._document = value;
    }

    static tokenStringMap: TokenStringMapType[] = [
        { key: ";", value: { type: TokenType.LineBreak } },
        { key: "version", value: { type: TokenType.Directive } },
        { key: "#include", value: { type: TokenType.Directive } },
    ];

    static literalRegex = /[#a-zA-Z]/;
    static literalRegexNext = /[a-zA-Z0-9]/;

    constructor(document: TextDocument) {
        this._document = document;
    }

    /**
     * This function is copy pasted from this guide: https://balit.boxxen.org/lexing/basic/index.html, and fixed
     *
     * @returns An array of Tokens.
     */
    tokenize(): Token[] {
        const timer = new Timer("tokenizer");
        const input = this.document.getText().trim();
        const out: Token[] = [];

        let currentPosition = 0;

        function lookaheadString(str: string): boolean {
            const parts = str.split("");

            console.log(str);

            for (let i = 0; i < parts.length; i++) {
                if (input[currentPosition + i] !== parts[i]) {
                    return false;
                }
            }

            return true;
        }

        function lookahead(match: RegExp, matchNext?: RegExp): string[] {
            const bucket: string[] = [];

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

            let didMatch: boolean = false;

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
