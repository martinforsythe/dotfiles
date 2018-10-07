"use strict";
const common_1 = require('./common');
const previewer_1 = require('../providers/previewer');
class CommandPreviewStatus extends common_1.Command {
    constructor() {
        super("plantuml.previewStatus");
    }
    execute(...args) {
        previewer_1.previewer.setUIStatus(JSON.stringify(args[0]));
    }
}
exports.CommandPreviewStatus = CommandPreviewStatus;
//# sourceMappingURL=previewStatus.js.map