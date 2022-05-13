"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var React = require("preact/compat");
var legacy_utils_1 = require("@walletconnect/legacy-utils");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var Footer_1 = require("./Footer");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var DesktopLink_1 = require("./DesktopLink");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var QRCodeDisplay_1 = require("./QRCodeDisplay");
var constants_1 = require("../constants");
function Modal(props) {
    var mobile = legacy_utils_1.isMobile();
    var displayProps = {
        mobile: mobile,
        text: props.text,
        uri: props.uri,
        qrcodeModalOptions: props.qrcodeModalOptions
    };
    return (React.createElement("div", { id: constants_1.WALLETCONNECT_MODAL_ID, className: "walletconnect-qrcode__base animated fadeIn" },
        React.createElement("div", { className: "walletconnect-modal__base" },
            React.createElement("h5", { className: "walletconnect-modal__title" }, props.text.connect_wallet),
            !mobile && React.createElement(QRCodeDisplay_1["default"], __assign({}, displayProps)),
            React.createElement(DesktopLink_1["default"], { text: props.text, wcUri: props.uri }),
            React.createElement(Footer_1["default"], { onClose: props.onClose }))));
}
exports["default"] = Modal;
