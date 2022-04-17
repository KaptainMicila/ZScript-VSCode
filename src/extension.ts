import * as vscode from 'vscode';
import ZScript from './zscript';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		ZScript,
	);
}
