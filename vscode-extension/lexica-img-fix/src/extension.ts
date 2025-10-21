// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lexica-img-fix" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposableHello = vscode.commands.registerCommand('lexica-img-fix.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from lexica-img-fix!');
	});

	context.subscriptions.push(disposableHello);

	const disposableMove = vscode.commands.registerCommand('lexica-img-fix.moveToImages', async (resource: vscode.Uri | undefined) => {
		try {
			let sourceUri: vscode.Uri | undefined = undefined;

			// If invoked from explorer, a resource URI is provided
			if (resource && resource instanceof vscode.Uri) {
				sourceUri = resource;
			} else {
				// If invoked from editor, try to detect an image path under the cursor
				const editor = vscode.window.activeTextEditor;
				if (editor && editor.document.languageId === 'markdown') {
					const doc = editor.document;
					const cursor = editor.selection.active;
					const range = doc.getWordRangeAtPosition(cursor, /!\[.*?\]\(([^)]+)\)/);
					if (range) {
						const text = doc.getText(range);
						const match = /!\[.*?\]\(([^)]+)\)/.exec(text);
						if (match && match[1]) {
							// Resolve relative path against the markdown file
							const imgPath = match[1];
							const docDir = path.dirname(doc.uri.fsPath);
							const resolved = path.resolve(docDir, imgPath);
							sourceUri = vscode.Uri.file(resolved);
						}
					}
				}
			}

			if (!sourceUri) {
				vscode.window.showErrorMessage('No image file found to move. Use the explorer context menu on an image, or place the cursor on an image link in a markdown file.');
				return;
			}

			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (!workspaceFolders || workspaceFolders.length === 0) {
				vscode.window.showErrorMessage('No workspace folder is open.');
				return;
			}

			// Use the first workspace folder
			const workspaceRoot = workspaceFolders[0].uri.fsPath;
			const config = vscode.workspace.getConfiguration('lexica-img-fix');
			const destFolderRel = config.get<string>('destinationFolder', 'public/images');
			const markdownPathPrefix = config.get<string>('markdownPathPrefix', '/images/');
			const destFolderAbs = path.join(workspaceRoot, destFolderRel);

			await fs.promises.mkdir(destFolderAbs, { recursive: true });

			const fileName = path.basename(sourceUri.fsPath);
			const destPath = path.join(destFolderAbs, fileName);

			// If destination exists, append a numeric suffix
			let finalDest = destPath;
			let counter = 1;
			while (await exists(finalDest)) {
				const parsed = path.parse(fileName);
				finalDest = path.join(destFolderAbs, `${parsed.name}-${counter}${parsed.ext}`);
				counter++;
			}

			await fs.promises.copyFile(sourceUri.fsPath, finalDest);
			await fs.promises.unlink(sourceUri.fsPath);

			// Update markdown files to reference the new path
			// Normalize prefix: ensure leading slash, no trailing slash
			let prefix = markdownPathPrefix.replace(/\\/g, '/');
			while (prefix.endsWith('/')) prefix = prefix.slice(0, -1);
			if (!prefix.startsWith('/')) prefix = '/' + prefix;
			const newMarkdownPath = toPosixPath(prefix + '/' + path.basename(finalDest));

			await updateMarkdownLinks(workspaceRoot, sourceUri.fsPath, newMarkdownPath);

			vscode.window.showInformationMessage(`Moved ${fileName} to ${destFolderRel}.`);
		} catch (err) {
			console.error(err);
			vscode.window.showErrorMessage('Failed to move image. See console for details.');
		}
	});

	context.subscriptions.push(disposableMove);
}

// This method is called when your extension is deactivated
export function deactivate() { }

async function exists(p: string) {
	try {
		await fs.promises.access(p);
		return true;
	} catch (e) {
		return false;
	}
}

async function updateMarkdownLinks(workspaceRoot: string, oldFsPath: string, newRelative: string) {
	// Find all markdown files in workspace
	const mdFiles = await vscode.workspace.findFiles('**/*.md');

	const oldPathUnix = toPosixPath(path.relative(workspaceRoot, oldFsPath));
	const oldBasename = path.basename(oldFsPath);

	for (const uri of mdFiles) {
		const doc = await vscode.workspace.openTextDocument(uri);
		const text = doc.getText();
		let replaced = text;

		// Replace absolute path references (relative to workspace) and basename matches
		const patterns = [escapeRegExp(oldPathUnix), escapeRegExp(oldBasename)];
		for (const pat of patterns) {
			const regex = new RegExp(pat, 'g');
			replaced = replaced.replace(regex, toPosixPath(newRelative));
		}

		if (replaced !== text) {
			const edit = new vscode.WorkspaceEdit();
			const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(text.length));
			edit.replace(uri, fullRange, replaced);
			await vscode.workspace.applyEdit(edit);
			await doc.save();
		}
	}
}

function toPosixPath(p: string) {
	return p.split(path.sep).join('/');
}

function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

vscode.window.showInformationMessage('Extension "lexica-img-fix" is now active!');