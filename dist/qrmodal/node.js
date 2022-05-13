"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.open = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
function open(uri) {
    // eslint-disable-next-line no-console
    qrcode_1.default.toString(uri, { type: "terminal" }).then(console.log);
}
exports.open = open;
function close() {
    // empty
}
exports.close = close;
