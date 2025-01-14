"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.binaryPreview', (uri) => {
        let curUri = undefined;
        if (uri) {
            curUri = uri;
        }
        else {
            if (vscode.window.activeTextEditor) {
                curUri = vscode.window.activeTextEditor.document.uri;
            }
        }
        if (curUri) {
            vscode.window.showInformationMessage(curUri.fsPath);
            fs.readFile(curUri.fsPath, (err, buffer) => {
                if (err) {
                    vscode.window.showErrorMessage(err.message);
                }
                else {
                    let panel = vscode.window.createWebviewPanel('binary-view', `${path.basename(curUri.path)}-preview`, vscode.ViewColumn.One);
                    panel.onDidDispose(() => {
                    });
                    let table = '<table>';
                    for (let i = 0; (i << 3) < buffer.length; i++) {
                        let tr = `<td>${get0xString(i << 3, 8)}:</td>`;
                        let j = 0;
                        while (j < 8 && (i << 3) + j < buffer.length) {
                            let val = buffer.readUInt8((i << 3) + j);
                            if (j & 1) {
                                tr += `${get0xString(val, 2)}</td>`;
                            }
                            else {
                                tr += `<td>${get0xString(val, 2)}`;
                            }
                            j++;
                        }
                        if ((j & 1)) {
                            tr += '</br>';
                        }
                        table += '<tr>' + tr + '</tr>';
                    }
                    table += '</table>';
                    panel.webview.html = htmlTemplate.replace('$', table);
                }
            });
        }
        else {
            vscode.window.showWarningMessage('无法正确获取到文件的路径');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
let htmlTemplate = `<!DOCTYPE html>
<html>
<head>
</head>
<body>
	$
</body>
</html>`;
function get0xString(val, len) {
    let res = val.toString(16);
    if (res.length < len) {
        res = '0'.repeat(len - res.length) + res;
    }
    return res;
}
//# sourceMappingURL=extension.js.map