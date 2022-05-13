"use strict";
exports.__esModule = true;
exports.close = exports.open = void 0;
var qrcode_1 = require("qrcode");
function open(uri) {
    // eslint-disable-next-line no-console
    qrcode_1["default"].toString(uri, { type: "terminal" }).then(console.log);
}
exports.open = open;
function close() {
    // empty
}
exports.close = close;
