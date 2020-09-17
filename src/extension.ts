// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	vscode.commands.executeCommand("editor.action.formatDocument")

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pretty-graphql.prettify', () => {
		// The code you place here will be executed every time your command is executed
		const config = vscode.workspace.getConfiguration('pretty-graphql')
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		var firstLine = editor.document.lineAt(0);
		var lastLine = editor.document.lineAt(editor.document.lineCount - 1);
		var textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
		let text = editor.document.getText();

		// console.log(textRange);
		let ignoreLineKey = ['scalar', 'query', 'mutation', '#', 'interface', 'extend', '"', 'type', '}', 'input', 'directive'];

		var lines = text.split('\n');

		var currentType = '';
		for(var i = 0;i < lines.length;i++){

			if(lines[i].trim().startsWith('}')) {
				currentType = '';
			}

			if(lines[i].trim().startsWith('type Query')) {
				currentType = 'query';
				continue;
			} else if(lines[i].trim().startsWith('type Mutation')) {
				currentType = 'mutation';
			} else if(lines[i].trim().startsWith('input')) {
				currentType = 'input';
			}

			if(currentType === 'query' || currentType === 'mutation') {
				continue;
			}

			if(lines[i].trim() && !ignoreLineKey.some((x) => lines[i].trim().startsWith(x))) {
				// console.log(lines[i]);
				if(lines[i].includes('):')) {
					var el = lines[i].trim().split('):');
					var one = el[0] + '):';
					var el2 = el[1].split(' ');
					var two = el2[0];
					var three = el2.splice(1).join(' ');

				} else {
					var el = lines[i].trim().split(' ').filter(Boolean);
					var one = el[0];
					var two = el[1];
					var three = el.splice(2).join(' ') ?? '';
					// console.log(one);
					
				}

				// console.log(parseInt(config.get('first') ?? ''));
				if(currentType === 'input') {
					lines[i] = '    ' + one.trim().padEnd(parseInt(config.get('inputFirst') ?? '')) + two.trim().padEnd(parseInt(config.get('inputSecond') ?? '')) + three.trim();
				} else {
					lines[i] = '    ' + one.trim().padEnd(parseInt(config.get('first') ?? '')) + two.trim().padEnd(parseInt(config.get('second') ?? '')) + three.trim();
				}
				
				
			}
		}

		var finalText = lines.join('\n');

		editor.edit((editBuilder) => {
			editBuilder.replace(textRange, finalText);
		});

		

		// console.log(text);

		// console.log('gg');

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
