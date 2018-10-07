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
const exportDocument_1 = require('../plantuml/exporter/exportDocument');
class CommandExportCurrent extends common_1.Command {
    constructor() {
        super("plantuml.exportCurrent");
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield exportDocument_1.exportDocument(false);
        });
    }
}
exports.CommandExportCurrent = CommandExportCurrent;
//# sourceMappingURL=exportCurrent.js.map