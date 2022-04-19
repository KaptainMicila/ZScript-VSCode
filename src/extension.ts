import * as vscode from 'vscode';
import ACS from './acs';
import MENUDEF from './menudef';
import WAD from './wad';
import ZScript from './zscript';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		...ZScript,
		...ACS,
		...MENUDEF,
		...WAD,
	);
}
