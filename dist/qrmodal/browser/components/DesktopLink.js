"use strict";
exports.__esModule = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var React = require("preact/compat");
var nufinetes_1 = require("../assets/nufinetes");
function DesktopLink(_a) {
    var wcUri = _a.wcUri, text = _a.text;
    console.log(text, 'check text');
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { onClick: function () {
                window.location.href = "vimwallet://--/connect?uri=" + wcUri;
            }, className: "walletconnect-modal__desktopLink" },
            React.createElement("div", { className: "walletconnect-modal__desktopLinkInner" },
                React.createElement("img", { src: nufinetes_1.NUFINETES_LOGO_SVG, className: "walletconnect-modal__nufinetesLogo" }),
                React.createElement("p", null, text.nufinetes_wallet)),
            React.createElement("svg", { focusable: "false", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "rgba(255, 255, 255, 0.6)" },
                React.createElement("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }))),
        React.createElement("a", { className: "walletconnect-modal_appLink", href: "https://nufinetes.com/", target: "_blank", rel: "noopener noreferrer" }, text.no_nufinetes)));
}
exports["default"] = DesktopLink;
