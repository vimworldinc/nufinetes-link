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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("preact/compat"));
const legacy_utils_1 = require("@walletconnect/legacy-utils");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Footer_1 = __importDefault(require("./Footer"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DesktopLink_1 = __importDefault(require("./DesktopLink"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QRCodeDisplay_1 = __importDefault(require("./QRCodeDisplay"));
const constants_1 = require("../constants");
function Modal(props) {
    const mobile = legacy_utils_1.isMobile();
    const displayProps = {
        mobile,
        text: props.text,
        uri: props.uri,
        qrcodeModalOptions: props.qrcodeModalOptions,
    };
    return (React.createElement("div", { id: constants_1.WALLETCONNECT_MODAL_ID, className: "walletconnect-qrcode__base animated fadeIn" },
        React.createElement("div", { className: "walletconnect-modal__base" },
            React.createElement("h5", { className: "walletconnect-modal__title" }, props.text.connect_wallet),
            !mobile && React.createElement(QRCodeDisplay_1.default, Object.assign({}, displayProps)),
            React.createElement(DesktopLink_1.default, { text: props.text, wcUri: props.uri }),
            React.createElement(Footer_1.default, { onClose: props.onClose }))));
}
exports.default = Modal;
