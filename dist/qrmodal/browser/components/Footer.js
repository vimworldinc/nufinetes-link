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
const arrow_1 = require("../assets/arrow");
const constants_1 = require("../constants");
function Footer(props) {
    return (React.createElement("div", { onClick: props.onClose, className: "walletconnect-modal__backButton" },
        React.createElement("img", { src: arrow_1.ARROW_SVG_URL, className: "walletconnect-modal__backButtonArrow" }),
        React.createElement("p", null, constants_1.WALLETCONNECT_FOOTER_TEXT)));
}
exports.default = Footer;
