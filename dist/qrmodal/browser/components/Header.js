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
const logo_1 = require("../assets/logo");
const constants_1 = require("../constants");
function Header(props) {
    return (React.createElement("div", { className: "walletconnect-modal__header" },
        React.createElement("img", { src: logo_1.WALLETCONNECT_LOGO_SVG_URL, className: "walletconnect-modal__headerLogo" }),
        React.createElement("p", null, constants_1.WALLETCONNECT_HEADER_TEXT),
        React.createElement("div", { className: "walletconnect-modal__close__wrapper", onClick: props.onClose },
            React.createElement("div", { id: constants_1.WALLETCONNECT_CLOSE_BUTTON_ID, className: "walletconnect-modal__close__icon" },
                React.createElement("div", { className: "walletconnect-modal__close__line1" }),
                React.createElement("div", { className: "walletconnect-modal__close__line2" })))));
}
exports.default = Header;
