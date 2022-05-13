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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const React = __importStar(require("preact/compat"));
const nufinetes_1 = require("../assets/nufinetes");
function DesktopLink({ wcUri, text }) {
    console.log(text, 'check text');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onClick: () => {
                window.location.href = `vimwallet://--/connect?uri=${wcUri}`;
            }, className: "walletconnect-modal__desktopLink" },
            React.createElement("div", { className: "walletconnect-modal__desktopLinkInner" },
                React.createElement("img", { src: nufinetes_1.NUFINETES_LOGO_SVG, className: "walletconnect-modal__nufinetesLogo" }),
                React.createElement("p", null, text.nufinetes_wallet)),
            React.createElement("svg", { focusable: "false", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "rgba(255, 255, 255, 0.6)" },
                React.createElement("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }))),
        React.createElement("a", { className: "walletconnect-modal_appLink", href: "https://nufinetes.com/", target: "_blank", rel: "noopener noreferrer" }, text.no_nufinetes)));
}
exports.default = DesktopLink;
