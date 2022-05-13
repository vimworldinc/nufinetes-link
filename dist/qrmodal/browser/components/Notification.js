"use strict";
exports.__esModule = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var React = require("preact/compat");
function Notification(props) {
    var show = !!props.message.trim();
    return (React.createElement("div", { className: "walletconnect-qrcode__notification" + (show ? " notification__show" : "") }, props.message));
}
exports["default"] = Notification;
