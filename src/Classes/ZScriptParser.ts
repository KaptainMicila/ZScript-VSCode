import { TextDocument, TextDocumentChangeEvent } from "vscode";
import { Timer } from "./Timer";
import { ZScriptTokenizer } from "./ZScriptTokenizer";

export default class ZScriptParser {
    private _document: TextDocument;

    public get document(): TextDocument {
        return this._document;
    }

    public set document(value: TextDocument) {
        this._document = value;
    }

    constructor(document: TextDocument) {
        this._document = document;
    }

    parse(textChanges?: TextDocumentChangeEvent) {}
}
