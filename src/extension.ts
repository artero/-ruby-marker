'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as childProcess from 'child_process';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ruby-markers" is now active!');

  let marker = new Markers();

  let hello = vscode.commands.registerCommand('extension.sayHello', () => {
    vscode.window.showInformationMessage('Hello World, Ruby Markers!');
  });

  let evaluate = vscode.commands.registerCommand('extension.evaluate', () => {
    marker.evaluate();
  });

  let addMark = vscode.commands.registerCommand('extension.addMark', () => {
    marker.addMark();
  });

  context.subscriptions.push(hello);
  context.subscriptions.push(evaluate);
  context.subscriptions.push(addMark);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class Markers {
  public evaluate(){
        // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    let content = document.getText().replace(/"/g, "\\\"");
    let comand = 'echo "' + content + '" | xmpfilter';

    let ls = childProcess.exec(comand, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
      }else{
        editor.edit(function (editBuilder) {
          let pos1 = new vscode.Position(0, 0);
          let pos2 = new vscode.Position(document.lineCount-1, document.lineAt(document.lineCount-1).text.length);
          let range = new vscode.Range(pos1, pos2);
          editBuilder.replace(range, stdout);
        });
      }
    });
  }

  public addMark(){
    console.log('add mark');
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    editor.edit((editBuilder) => {
      for (let selection of editor.selections) {
        let line = selection.end.line
        var lineText = document.lineAt(line).text
        var pos1 = new vscode.Position(line, 0);
        var pos2 = new vscode.Position(line, lineText.length);
        var range = new vscode.Range(pos1, pos2);
        var spaces = (lineText.length < 50) ? 50 - lineText.length : 1
        var output = lineText + " ".repeat(spaces) + "# =>"
        editBuilder.replace(range, output);
      }
    });
  }
}