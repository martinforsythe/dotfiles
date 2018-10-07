"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const common_1 = require('./common');
const exportWorkSpace_1 = require('../plantuml/exporter/exportWorkSpace');
class CommandExportWorkspace extends common_1.Command {
    constructor() {
        super("plantuml.exportWorkspace");
    }
    execute(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            yield exportWorkSpace_1.exportWorkSpace(uri);
        });
    }
}
exports.CommandExportWorkspace = CommandExportWorkspace;
//# sourceMappingURL=exportWorkspace.js.map