"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs_1 = require("./fs");
/**
 * Gets saved accent
 */
function getAccent() {
    return getCustomSettings().accent;
}
exports.getAccent = getAccent;
/**
 * Gets custom settings
 */
function getCustomSettings() {
    return vscode.workspace.getConfiguration().get('materialTheme', {});
}
exports.getCustomSettings = getCustomSettings;
/**
 * Get autoApplyIcons
 */
function isAutoApplyEnable() {
    return vscode.workspace.getConfiguration().get('materialTheme.autoApplyIcons', true);
}
exports.isAutoApplyEnable = isAutoApplyEnable;
/**
 * Checks if a given string could be an accent
 */
function isAccent(accentName, defaults) {
    return Boolean(Object.keys(defaults.accents).find(name => name === accentName));
}
exports.isAccent = isAccent;
/**
 * Determines if the passing theme label is a material theme
 */
function isMaterialTheme(themeName) {
    const packageJSON = fs_1.getPackageJSON();
    return Boolean(packageJSON.contributes.themes.find(contrib => contrib.label === themeName));
}
exports.isMaterialTheme = isMaterialTheme;
/**
 * Determines if the passing icons theme is a material theme
 */
function isMaterialThemeIcons(themeIconsName) {
    const packageJSON = fs_1.getPackageJSON();
    return Boolean(packageJSON.contributes.iconThemes.find(contribute => contribute.id === themeIconsName));
}
exports.isMaterialThemeIcons = isMaterialThemeIcons;
/**
 * Sets a custom property in custom settings
 */
function setCustomSetting(settingName, value) {
    return vscode.workspace.getConfiguration().update(`materialTheme.${settingName}`, value, true).then(() => settingName);
}
exports.setCustomSetting = setCustomSetting;
/**
 * Updates accent name
 */
function updateAccent(accentName) {
    const prevAccent = getAccent();
    return setCustomSetting('accentPrevious', prevAccent)
        .then(() => setCustomSetting('accent', accentName));
}
exports.updateAccent = updateAccent;
//# sourceMappingURL=settings.js.map