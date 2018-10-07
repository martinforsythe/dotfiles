"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const diagram_1 = require('../plantuml/diagram/diagram');
const config_1 = require('../plantuml/config');
const common_1 = require('../plantuml/common');
const tools_1 = require('../plantuml/tools');
const exportToBuffer_1 = require("../plantuml/exporter/exportToBuffer");
const context_1 = require('../plantuml/context');
var previewStatus;
(function (previewStatus) {
    previewStatus[previewStatus["default"] = 0] = "default";
    previewStatus[previewStatus["error"] = 1] = "error";
    previewStatus[previewStatus["processing"] = 2] = "processing";
})(previewStatus || (previewStatus = {}));
class Previewer extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this.Emittor = new vscode.EventEmitter();
        this.onDidChange = this.Emittor.event;
        this.Uri = vscode.Uri.parse('plantuml://preview');
        this._disposables = [];
        this.watchDisposables = [];
        this.error = "";
        this.zoomUpperLimit = false;
        this.killingLock = false;
        this.register();
    }
    dispose() {
        this._disposables && this._disposables.length && this._disposables.map(d => d.dispose());
        this.watchDisposables && this.watchDisposables.length && this.watchDisposables.map(d => d.dispose());
    }
    reset() {
        let tplPreviewPath = path.join(context_1.contextManager.context.extensionPath, "templates", "preview.html");
        this.template = '`' + fs.readFileSync(tplPreviewPath, "utf-8") + '`';
        this.rendered = null;
        this.uiStatus = "";
        this.images = [];
        this.imageError = "";
        this.error = "";
    }
    provideTextDocumentContent(uri, token) {
        //start watching changes
        if (config_1.config.previewAutoUpdate)
            this.startWatch();
        else
            this.stopWatch();
        let images = this.images.reduce((p, c) => {
            return `${p}<img src="${c}">`;
        }, "");
        let imageError;
        let error;
        let tmplPath = "file:///" + path.join(context_1.contextManager.context.extensionPath, "templates");
        let status = this.uiStatus;
        let nonce = Math.random().toString(36).substr(2);
        let pageInfo = common_1.localize(20, null);
        let icon = "file:///" + path.join(context_1.contextManager.context.extensionPath, "images", "icon.png");
        let processingTip = common_1.localize(9, null);
        let snapBottomTitle = common_1.localize(35, null);
        let snapRightTitle = common_1.localize(36, null);
        let snapTopTitle = common_1.localize(37, null);
        let snapLeftTitle = common_1.localize(38, null);
        let settings = JSON.stringify({
            zoomUpperLimit: this.zoomUpperLimit,
            showSpinner: this.status == previewStatus.processing,
            showSnapIndicators: config_1.config.previewSnapIndicators,
        });
        try {
            switch (this.status) {
                case previewStatus.default:
                case previewStatus.error:
                    imageError = this.imageError;
                    error = this.error.replace(/\n/g, "<br />");
                    return eval(this.template);
                case previewStatus.processing:
                    error = "";
                    images = ["svg", "png"].reduce((p, c) => {
                        if (p)
                            return p;
                        let exported = tools_1.calculateExportPath(this.rendered, c);
                        exported = tools_1.addFileIndex(exported, 0, this.rendered.pageCount);
                        return fs.existsSync(exported) ? images = `<img src="file:///${exported}">` : "";
                    }, "");
                    return eval(this.template);
                default:
                    return "";
            }
        }
        catch (error) {
            return error;
        }
    }
    setUIStatus(status) {
        this.uiStatus = status;
    }
    update(processingTip) {
        try {
            //FIXME: last update may not happen due to killingLock
            if (this.killingLock)
                return;
            if (this.task)
                this.task.canceled = true;
            if (this.task && this.task.processes && this.task.processes.length) {
                this.killingLock = true;
                //kill lats unfinished task.
                // let pid = this.process.pid;
                this.task.processes.map((p, i) => {
                    p.kill();
                    if (i == this.task.processes.length - 1) {
                        //start next preview only when last process is killed
                        p.on('exit', (code) => {
                            // console.log(`killed (${pid} ${code}) and restart!`);
                            this.task.processes = [];
                            this.doUpdate(processingTip);
                            this.killingLock = false;
                        });
                    }
                });
                return;
            }
            this.doUpdate(processingTip).catch(e => tools_1.showMessagePanel(e));
        }
        catch (error) {
            tools_1.showMessagePanel(error);
        }
    }
    get TargetChanged() {
        let current = diagram_1.currentDiagram();
        if (!current)
            return false;
        let changed = (!this.rendered || !this.rendered.isEqual(current));
        if (changed) {
            this.rendered = current;
            this.error = "";
            this.images = [];
            this.imageError = "";
            this.uiStatus = "";
        }
        return changed;
    }
    doUpdate(processingTip) {
        return __awaiter(this, void 0, void 0, function* () {
            let diagram = diagram_1.currentDiagram();
            if (!diagram) {
                this.status = previewStatus.error;
                this.error = common_1.localize(3, null);
                this.images = [];
                this.Emittor.fire(this.Uri);
                return;
            }
            let task = exportToBuffer_1.exportToBuffer(diagram, "svg");
            this.task = task;
            // console.log(`start pid ${this.process.pid}!`);
            if (processingTip)
                this.processing();
            yield task.promise.then(result => {
                if (task.canceled)
                    return;
                this.task = null;
                this.status = previewStatus.default;
                this.error = "";
                this.imageError = "";
                this.images = result.reduce((p, buf) => {
                    let isSvg = buf.slice(0, 5).toString() == "<?xml";
                    let b64 = buf.toString('base64');
                    if (!b64)
                        return p;
                    p.push(`data:image/${isSvg ? "svg+xml" : 'png'};base64,${b64}`);
                    return p;
                }, []);
                this.Emittor.fire(this.Uri);
            }, error => {
                if (task.canceled)
                    return;
                this.task = null;
                this.status = previewStatus.error;
                let err = tools_1.parseError(error)[0];
                this.error = err.error;
                let b64 = err.out.toString('base64');
                if (!(b64 || err.error))
                    return;
                this.imageError = `data:image/svg+xml;base64,${b64}`;
                this.Emittor.fire(this.Uri);
            });
        });
    }
    //display processing tip
    processing() {
        this.status = previewStatus.processing;
        this.Emittor.fire(this.Uri);
    }
    register() {
        let disposable;
        //register provider
        disposable = vscode.workspace.registerTextDocumentContentProvider('plantuml', this);
        this._disposables.push(disposable);
        //register command
        disposable = vscode.commands.registerCommand('plantuml.preview', () => {
            try {
                var editor = vscode.window.activeTextEditor;
                if (!editor)
                    return;
                let diagrams = diagram_1.diagramsOf(editor.document);
                if (!diagrams.length)
                    return;
                //reset in case that starting commnad in none-diagram area, 
                //or it may show last error image and may cause wrong "TargetChanged" result on cursor move.
                this.reset();
                this.TargetChanged;
                //update preview
                this.update(true);
                vscode.commands.executeCommand('vscode.previewHtml', this.Uri, vscode.ViewColumn.Two, common_1.localize(17, null))
                    .then(null, error => tools_1.showMessagePanel(error));
            }
            catch (error) {
                tools_1.showMessagePanel(error);
            }
        });
        this._disposables.push(disposable);
    }
    startWatch() {
        if (this.watchDisposables.length)
            return;
        let disposable;
        let disposables = [];
        //register watcher
        let lastTimestamp = new Date().getTime();
        disposable = vscode.workspace.onDidChangeTextDocument(e => {
            if (!e || !e.document || !e.document.uri)
                return;
            if (e.document.uri.scheme == "plantuml")
                return;
            lastTimestamp = new Date().getTime();
            setTimeout(() => {
                if (new Date().getTime() - lastTimestamp >= 400) {
                    if (!diagram_1.currentDiagram())
                        return;
                    this.update(false);
                }
            }, 500);
        });
        disposables.push(disposable);
        disposable = vscode.window.onDidChangeTextEditorSelection(e => {
            lastTimestamp = new Date().getTime();
            setTimeout(() => {
                if (new Date().getTime() - lastTimestamp >= 400) {
                    if (!this.TargetChanged)
                        return;
                    this.update(true);
                }
            }, 500);
        });
        disposables.push(disposable);
        //stop watcher when preview window is closed
        disposable = vscode.workspace.onDidCloseTextDocument(e => {
            if (e.uri.scheme === this.Uri.scheme) {
                this.stopWatch();
            }
        });
        disposables.push(disposable);
        this.watchDisposables = disposables;
    }
    stopWatch() {
        for (let d of this.watchDisposables) {
            d.dispose();
        }
        this.watchDisposables = [];
    }
}
exports.previewer = new Previewer();
//# sourceMappingURL=previewer.js.map