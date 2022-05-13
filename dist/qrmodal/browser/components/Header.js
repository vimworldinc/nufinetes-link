"use strict";
exports.__esModule = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var React = require("preact/compat");
var logo_1 = require("../assets/logo");
var constants_1 = require("../constants");
function Header(props) {
    return (React.createElement("div", { className: "walletconnect-modal__header" },
        React.createElement("img", { src: logo_1.WALLETCONNECT_LOGO_SVG_URL, className: "walletconnect-modal__headerLogo" }),
        React.createElement("p", null, constants_1.WALLETCONNECT_HEADER_TEXT),
        React.createElement("div", { className: "walletconnect-modal__close__wrapper", onClick: props.onClose },
            React.createElement("div", { id: constants_1.WALLETCONNECT_CLOSE_BUTTON_ID, className: "walletconnect-modal__close__icon" },
                React.createElement("div", { className: "walletconnect-modal__close__line1" }),
                React.createElement("div", { className: "walletconnect-modal__close__line2" })))));
}
exports["default"] = Header;
