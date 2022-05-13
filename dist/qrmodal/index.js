"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodeLib = __importStar(require("./node"));
const browserLib = __importStar(require("./browser"));
const isNode = () => typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    typeof process.versions.node !== 'undefined';
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
exports.default = { open, close };
