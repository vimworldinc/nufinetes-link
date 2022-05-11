"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magic = void 0;
const types_1 = require("@web3-react/types");
class Magic extends types_1.Connector {
    constructor(actions, options) {
        super(actions);
        this.options = options;
    }
    startListening(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.options, { apiKey } = _a, options = __rest(_a, ["apiKey"]);
            return Promise.resolve().then(() => __importStar(require('magic-sdk'))).then((m) => __awaiter(this, void 0, void 0, function* () {
                this.magic = new m.Magic(apiKey, options);
                yield this.magic.auth.loginWithMagicLink(configuration);
                const [Web3Provider, Eip1193Bridge] = yield Promise.all([
                    Promise.resolve().then(() => __importStar(require('@ethersproject/providers'))).then(({ Web3Provider }) => Web3Provider),
                    Promise.resolve().then(() => __importStar(require('@ethersproject/experimental'))).then(({ Eip1193Bridge }) => Eip1193Bridge),
                ]);
                const provider = new Web3Provider(this.magic.rpcProvider);
                this.provider = new Eip1193Bridge(provider.getSigner(), provider);
            }));
        });
    }
    activate(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            this.actions.startActivation();
            yield this.startListening(configuration).catch((error) => {
                this.actions.reportError(error);
            });
            if (this.provider) {
                yield Promise.all([
                    this.provider.request({ method: 'eth_chainId' }),
                    this.provider.request({ method: 'eth_accounts' }),
                ])
                    .then(([chainId, accounts]) => {
                    this.actions.update({ chainId: Number.parseInt(chainId, 16), accounts });
                })
                    .catch((error) => {
                    this.actions.reportError(error);
                });
            }
        });
    }
}
exports.Magic = Magic;
