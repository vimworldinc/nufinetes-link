"use strict";
exports.__esModule = true;
var nodeLib = require("./node");
var browserLib = require("./browser");
var isNode = function () {
    return typeof process !== 'undefined' &&
        typeof process.versions !== 'undefined' &&
        typeof process.versions.node !== 'undefined';
};
function open(uri, cb, qrcodeModalOptions) {
    // eslint-disable-next-line no-console
    if (isNode()) {
        nodeLib.open(uri);
    }
    else {
        browserLib.open(uri, cb, qrcodeModalOptions);
    }
}
function close() {
    if (isNode()) {
        nodeLib.close();
    }
    else {
        browserLib.close();
    }
}
exports["default"] = { open: open, close: close };
