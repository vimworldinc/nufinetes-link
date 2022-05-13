"use strict";
exports.__esModule = true;
exports.close = exports.open = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var React = require("preact/compat");
// @ts-ignore
var ReactDOM = require("preact/compat");
var legacy_utils_1 = require("@walletconnect/legacy-utils");
var style_1 = require("./assets/style");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var Modal_1 = require("./components/Modal");
var languages_1 = require("./languages");
var constants_1 = require("./constants");
function injectStyleSheet() {
    var doc = legacy_utils_1.getDocumentOrThrow();
    var prev = doc.getElementById(constants_1.WALLETCONNECT_STYLE_ID);
    if (prev) {
        doc.head.removeChild(prev);
    }
    var style = doc.createElement('style');
    style.setAttribute('id', constants_1.WALLETCONNECT_STYLE_ID);
    style.innerText = style_1.WALLETCONNECT_STYLE_SHEET;
    doc.head.appendChild(style);
}
function renderWrapper() {
    var doc = legacy_utils_1.getDocumentOrThrow();
    var wrapper = doc.createElement('div');
    wrapper.setAttribute('id', constants_1.WALLETCONNECT_WRAPPER_ID);
    doc.body.appendChild(wrapper);
    return wrapper;
}
function triggerCloseAnimation() {
    var doc = legacy_utils_1.getDocumentOrThrow();
    var modal = doc.getElementById(constants_1.WALLETCONNECT_MODAL_ID);
    if (modal) {
        modal.className = modal.className.replace('fadeIn', 'fadeOut');
        setTimeout(function () {
            var wrapper = doc.getElementById(constants_1.WALLETCONNECT_WRAPPER_ID);
            if (wrapper) {
                doc.body.removeChild(wrapper);
            }
        }, constants_1.ANIMATION_DURATION);
    }
}
function getWrappedCallback(cb) {
    return function () {
        triggerCloseAnimation();
        if (cb) {
            cb();
        }
    };
}
function getText() {
    var lang = legacy_utils_1.getNavigatorOrThrow().language.split('-')[0] || 'en';
    return languages_1["default"][lang] || languages_1["default"]['en'];
}
function open(uri, cb, qrcodeModalOptions) {
    injectStyleSheet();
    var wrapper = renderWrapper();
    ReactDOM.render(React.createElement(Modal_1["default"], { text: getText(), uri: uri, onClose: getWrappedCallback(cb), qrcodeModalOptions: qrcodeModalOptions }), wrapper);
}
exports.open = open;
function close() {
    triggerCloseAnimation();
}
exports.close = close;
