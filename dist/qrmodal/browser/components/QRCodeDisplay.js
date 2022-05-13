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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const React = __importStar(require("preact/compat"));
const qrcode_1 = __importDefault(require("qrcode"));
// import copy from 'copy-to-clipboard'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Notification from './Notification'
const constants_1 = require("../constants");
function formatQRCodeImage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = '';
        const dataString = yield qrcode_1.default.toString(data, { margin: 0, type: 'svg' });
        if (typeof dataString === 'string') {
            result = dataString.replace('<svg', `<svg class="walletconnect-qrcode__image"`);
        }
        return result;
    });
}
function QRCodeDisplay(props) {
    // const [notification, setNotification] = React.useState('')
    const [svg, setSvg] = React.useState('');
    React.useEffect(() => {
        ;
        (() => __awaiter(this, void 0, void 0, function* () {
            setSvg(yield formatQRCodeImage(props.uri));
        }))();
    }, []);
    // const copyToClipboard = () => {
    //   const success = copy(props.uri)
    //   if (success) {
    //     setNotification(props.text.copied_to_clipboard)
    //     setInterval(() => setNotification(''), 1200)
    //   } else {
    //     setNotification('Error')
    //     setInterval(() => setNotification(''), 1200)
    //   }
    // }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "walletconnect-qrcode__displayWrap" },
            React.createElement("div", { dangerouslySetInnerHTML: { __html: svg } })),
        React.createElement("p", { id: constants_1.WALLETCONNECT_CTA_TEXT_ID, className: "walletconnect-qrcode__text" }, props.text.scan_qrcode_with_wallet)));
}
exports.default = QRCodeDisplay;
