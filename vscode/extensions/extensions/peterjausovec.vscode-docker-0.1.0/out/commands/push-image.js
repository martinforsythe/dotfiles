"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telemetry_1 = require("../telemetry/telemetry");
const create_terminal_1 = require("./utils/create-terminal");
const quick_pick_image_1 = require("./utils/quick-pick-image");
const teleCmdId = 'vscode-docker.image.push';
const teleAzureId = 'vscode-docker.image.push.azureContainerRegistry';
function pushImage(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let imageToPush;
        let imageName = "";
        if (context && context.imageDesc) {
            imageToPush = context.imageDesc;
            imageName = context.label;
        }
        else {
            const selectedItem = yield quick_pick_image_1.quickPickImage();
            if (selectedItem) {
                imageToPush = selectedItem.imageDesc;
                imageName = selectedItem.label;
            }
        }
        if (imageToPush) {
            const terminal = create_terminal_1.createTerminal(imageName);
            terminal.sendText(`docker push ${imageName}`);
            terminal.show();
            if (telemetry_1.reporter) {
                /* __GDPR__
                   "command" : {
                      "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                   }
                 */
                telemetry_1.reporter.sendTelemetryEvent('command', {
                    command: teleCmdId
                });
                if (imageName.toLowerCase().indexOf('azurecr.io')) {
                    /* __GDPR__
                       "command" : {
                          "command" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                       }
                     */
                    telemetry_1.reporter.sendTelemetryEvent('command', {
                        command: teleAzureId
                    });
                }
            }
        }
    });
}
exports.pushImage = pushImage;
//# sourceMappingURL=push-image.js.map