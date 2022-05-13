"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const de_1 = __importDefault(require("./de"));
const en_1 = __importDefault(require("./en"));
const es_1 = __importDefault(require("./es"));
const fr_1 = __importDefault(require("./fr"));
const ko_1 = __importDefault(require("./ko"));
const pt_1 = __importDefault(require("./pt"));
const zh_1 = __importDefault(require("./zh"));
const fa_1 = __importDefault(require("./fa"));
const languages = { de: de_1.default, en: en_1.default, es: es_1.default, fr: fr_1.default, ko: ko_1.default, pt: pt_1.default, zh: zh_1.default, fa: fa_1.default };
exports.default = languages;
