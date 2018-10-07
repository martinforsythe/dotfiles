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
const extractSource_1 = require('../plantuml/sourceExtracter/extractSource');
class CommandExtractSource extends common_1.Command {
    constructor() {
        super("plantuml.extractSource");
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield extractSource_1.extractSource();
        });
    }
}
exports.CommandExtractSource = CommandExtractSource;
//# sourceMappingURL=extractSource.js.map