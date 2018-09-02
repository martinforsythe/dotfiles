"use strict";
const fs = require('fs');
const zlib = require('zlib');
const config_1 = require('../config');
const tools_1 = require('../tools');
const request = require('request');
class PlantumlServer {
    /**
     * Indicates the exporter should limt concurrency or not.
     * @returns boolean
     */
    limitConcurrency() {
        return false;
    }
    /**
     * formats return an string array of formats that the exporter supports.
     * @returns an array of supported formats
     */
    formats() {
        return [
            "png",
            "svg",
            "txt"
        ];
    }
    /**
     * export a diagram to file or to Buffer.
     * @param diagram The diagram to export.
     * @param format format of export file.
     * @param savePath if savePath is given, it exports to a file, or, to Buffer.
     * @returns ExportTask.
     */
    render(diagram, format, savePath) {
        let allPms = [...Array(diagram.pageCount).keys()].map((index) => {
            let requestUrl = this.makeURL(diagram, format);
            if (config_1.config.serverIndexParameter) {
                requestUrl += "?" + config_1.config.serverIndexParameter + "=" + index;
            }
            let savePath2 = savePath ? tools_1.addFileIndex(savePath, index, diagram.pageCount) : "";
            return this.httpWrapper(requestUrl, savePath2).then(result => new Promise((resolve, reject) => {
                let stdout = result[0];
                let stderr = result[1].toString();
                if (stderr.length) {
                    reject(stderr);
                }
                else {
                    resolve(stdout);
                }
                ;
            }));
        }, Promise.resolve(new Buffer("")));
        return {
            processes: [],
            promise: Promise.all(allPms),
        };
    }
    getMapData(diagram, savePath) {
        return this.render(diagram, "map", savePath);
    }
    httpWrapper(requestUrl, savePath) {
        return new Promise((resolve, reject) => {
            request({
                method: 'GET',
                uri: requestUrl,
                encoding: null // for byte encoding. Otherwise string.
                ,
                gzip: true
            }, (error, response, body) => {
                let stdout = "";
                let stderr = "";
                if (!error) {
                    if (response.statusCode === 200) {
                        if (savePath) {
                            if (body.length) {
                                fs.writeFileSync(savePath, body);
                                stdout = savePath;
                            }
                            else {
                                stdout = "";
                            }
                        }
                        else {
                            stdout = body;
                        }
                    }
                    else {
                        stderr = "Unexpected Statuscode: "
                            + response.statusCode + "\n"
                            + "for GET " + requestUrl;
                    }
                }
                else {
                    stderr = error.message;
                }
                resolve([new Buffer(stdout), new Buffer(stderr)]);
            });
        });
    }
    /**
     * make url for a diagram
     * @param diagram diagram to make the URL
     * @param format url format
     * @return string of URL
     */
    makeURL(diagram, format) {
        return [config_1.config.server.replace(/^\/|\/$/g, ""), format, this.urlTextFrom(diagram.content)].join("/");
    }
    urlTextFrom(s) {
        let opt = { level: 9 };
        let d = zlib.deflateRawSync(new Buffer(s), opt);
        let b = encode64(String.fromCharCode(...d.subarray(0)));
        return b;
        // from synchro.js
        /* Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
         * Version: 1.0.1
         * LastModified: Dec 25 1999
         */
        function encode64(data) {
            let r = "";
            for (let i = 0; i < data.length; i += 3) {
                if (i + 2 == data.length) {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
                }
                else if (i + 1 == data.length) {
                    r += append3bytes(data.charCodeAt(i), 0, 0);
                }
                else {
                    r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
                }
            }
            return r;
        }
        function append3bytes(b1, b2, b3) {
            let c1 = b1 >> 2;
            let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
            let c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
            let c4 = b3 & 0x3F;
            let r = "";
            r += encode6bit(c1 & 0x3F);
            r += encode6bit(c2 & 0x3F);
            r += encode6bit(c3 & 0x3F);
            r += encode6bit(c4 & 0x3F);
            return r;
        }
        function encode6bit(b) {
            if (b < 10) {
                return String.fromCharCode(48 + b);
            }
            b -= 10;
            if (b < 26) {
                return String.fromCharCode(65 + b);
            }
            b -= 26;
            if (b < 26) {
                return String.fromCharCode(97 + b);
            }
            b -= 26;
            if (b == 0) {
                return '-';
            }
            if (b == 1) {
                return '_';
            }
            return '?';
        }
    }
}
exports.plantumlServer = new PlantumlServer();
//# sourceMappingURL=plantumlServer.js.map