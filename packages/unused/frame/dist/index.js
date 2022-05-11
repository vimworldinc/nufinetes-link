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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = exports.NoFrameError = void 0;
const types_1 = require("@web3-react/types");
class NoFrameError extends Error {
    constructor() {
        super('Frame not installed');
        this.name = NoFrameError.name;
        Object.setPrototypeOf(this, NoFrameError.prototype);
    }
}
exports.NoFrameError = NoFrameError;
function parseChainId(chainId) {
    return Number.parseInt(chainId, 16);
}
class Frame extends types_1.Connector {
    constructor(actions, options, connectEagerly = true) {
        super(actions);
        this.options = options;
        if (connectEagerly) {
            this.providerPromise = this.startListening(connectEagerly);
        }
    }
    startListening(connectEagerly) {
        return __awaiter(this, void 0, void 0, function* () {
            const ethProvider = yield Promise.resolve().then(() => __importStar(require('eth-provider'))).then((m) => m.default);
            try {
                this.provider = ethProvider('frame', this.options);
            }
            catch (error) {
                this.actions.reportError(error);
            }
            if (this.provider) {
                this.provider.on('connect', ({ chainId }) => {
                    this.actions.update({ chainId: parseChainId(chainId) });
                });
                this.provider.on('disconnect', (error) => {
                    this.actions.reportError(error);
                });
                this.provider.on('chainChanged', (chainId) => {
                    this.actions.update({ chainId: parseChainId(chainId) });
                });
                this.provider.on('accountsChanged', (accounts) => {
                    this.actions.update({ accounts });
                });
                if (connectEagerly) {
                    return Promise.all([
                        this.provider.request({ method: 'eth_chainId' }),
                        this.provider.request({ method: 'eth_accounts' }),
                    ])
                        .then(([chainId, accounts]) => {
                        if ((accounts === null || accounts === void 0 ? void 0 : accounts.length) > 0) {
                            this.actions.update({ chainId: parseChainId(chainId), accounts });
                        }
                    })
                        .catch((error) => {
                        console.debug('Could not connect eagerly', error);
                    });
                }
            }
        });
    }
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.actions.startActivation();
            if (!this.providerPromise) {
                this.providerPromise = this.startListening(false);
            }
            yield this.providerPromise;
            if (this.provider) {
                yield Promise.all([
                    this.provider.request({ method: 'eth_chainId' }),
                    this.provider.request({ method: 'eth_requestAccounts' }),
                ])
                    .then(([chainId, accounts]) => {
                    this.actions.update({ chainId: parseChainId(chainId), accounts });
                })
                    .catch((error) => {
                    this.actions.reportError(error);
                });
            }
            else {
                this.actions.reportError(new NoFrameError());
            }
        });
    }
}
exports.Frame = Frame;
