import { MarkdownString, CompletionItemKind } from "vscode";

export default interface CompletitionOptions {
    defaultDescription?: MarkdownString;
    customIcon?: CompletionItemKind;
    customDetail?: string;
}
