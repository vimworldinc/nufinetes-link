"use strict";
exports.__esModule = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var React = require("preact/compat");
var arrow_1 = require("../assets/arrow");
var constants_1 = require("../constants");
function Footer(props) {
    return (React.createElement("div", { onClick: props.onClose, className: "walletconnect-modal__backButton" },
        React.createElement("img", { src: arrow_1.ARROW_SVG_URL, className: "walletconnect-modal__backButtonArrow" }),
        React.createElement("p", null, constants_1.WALLETCONNECT_FOOTER_TEXT)));
}
exports["default"] = Footer;
