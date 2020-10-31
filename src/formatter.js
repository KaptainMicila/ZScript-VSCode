// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

vscode.languages.registerDocumentFormattingEditProvider('zscript', {
    provideDocumentFormattingEdits(document) {
		
    },
});
