import * as vscode from 'vscode';
import ACS from './acs';
import ZScript from './zscript';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		ZScript,
		ACS,
	);
}
