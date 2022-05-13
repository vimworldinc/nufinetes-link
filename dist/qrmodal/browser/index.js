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
exports.close = exports.open = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const React = __importStar(require("preact/compat"));
// @ts-ignore
const ReactDOM = __importStar(require("preact/compat"));
const legacy_utils_1 = require("@walletconnect/legacy-utils");
const style_1 = require("./assets/style");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Modal_1 = __importDefault(require("./components/Modal"));
const languages_1 = __importDefault(require("./languages"));
const constants_1 = require("./constants");
function injectStyleSheet() {
    const doc = legacy_utils_1.getDocumentOrThrow();
    const prev = doc.getElementById(constants_1.WALLETCONNECT_STYLE_ID);
    if (prev) {
        doc.head.removeChild(prev);
    }
    const style = doc.createElement('style');
    style.setAttribute('id', constants_1.WALLETCONNECT_STYLE_ID);
    style.innerText = style_1.WALLETCONNECT_STYLE_SHEET;
    doc.head.appendChild(style);
}
function renderWrapper() {
    const doc = legacy_utils_1.getDocumentOrThrow();
    const wrapper = doc.createElement('div');
    wrapper.setAttribute('id', constants_1.WALLETCONNECT_WRAPPER_ID);
    doc.body.appendChild(wrapper);
    return wrapper;
}
function triggerCloseAnimation() {
    const doc = legacy_utils_1.getDocumentOrThrow();
    const modal = doc.getElementById(constants_1.WALLETCONNECT_MODAL_ID);
    if (modal) {
        modal.className = modal.className.replace('fadeIn', 'fadeOut');
        setTimeout(() => {
            const wrapper = doc.getElementById(constants_1.WALLETCONNECT_WRAPPER_ID);
            if (wrapper) {
                doc.body.removeChild(wrapper);
            }
        }, constants_1.ANIMATION_DURATION);
    }
}
function getWrappedCallback(cb) {
    return () => {
        triggerCloseAnimation();
        if (cb) {
            cb();
        }
    };
}
function getText() {
    const lang = legacy_utils_1.getNavigatorOrThrow().language.split('-')[0] || 'en';
    return languages_1.default[lang] || languages_1.default['en'];
}
function open(uri, cb, qrcodeModalOptions) {
    injectStyleSheet();
    const wrapper = renderWrapper();
    ReactDOM.render(React.createElement(Modal_1.default, { text: getText(), uri: uri, onClose: getWrappedCallback(cb), qrcodeModalOptions: qrcodeModalOptions }), wrapper);
}
exports.open = open;
function close() {
    triggerCloseAnimation();
}
exports.close = close;
