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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = exports.URI_AVAILABLE = void 0;
const types_1 = require("@web3-react/types");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const utils_1 = require("./utils");
exports.URI_AVAILABLE = 'URI_AVAILABLE';
function parseChainId(chainId) {
    return typeof chainId === 'string' ? Number.parseInt(chainId) : chainId;
}
class WalletConnect extends types_1.Connector {
    /**
     * @param options - Options to pass to `@walletconnect/ethereum-provider`
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     */
    constructor(actions, options, connectEagerly = false, treatModalCloseAsError = true) {
        super(actions);
        this.events = new eventemitter3_1.default();
        this.disconnectListener = (error) => {
            this.actions.reportError(error);
        };
        this.chainChangedListener = (chainId) => {
            this.actions.update({ chainId: parseChainId(chainId) });
        };
        this.accountsChangedListener = (accounts) => {
            this.actions.update({ accounts });
        };
        this.URIListener = (_, payload) => {
            this.events.emit(exports.URI_AVAILABLE, payload.params[0]);
        };
        if (connectEagerly && typeof window === 'undefined') {
            throw new Error('connectEagerly = true is invalid for SSR, instead use the connectEagerly method in a useEffect');
        }
        const { rpc } = options, rest = __rest(options, ["rpc"]);
        this.rpc = Object.keys(rpc).reduce((accumulator, chainId) => {
            const value = rpc[Number(chainId)];
            accumulator[Number(chainId)] = Array.isArray(value) ? value : [value];
            return accumulator;
        }, {});
        this.options = rest;
        this.treatModalCloseAsError = treatModalCloseAsError;
        if (connectEagerly)
            void this.connectEagerly();
    }
    isomorphicInitialize(chainId = Number(Object.keys(this.rpc)[0])) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.eagerConnection)
                return this.eagerConnection;
            // because we can only use 1 url per chainId, we need to decide between multiple, where necessary
            const rpc = Promise.all(Object.keys(this.rpc).map((chainId) => __awaiter(this, void 0, void 0, function* () { return [Number(chainId), yield (0, utils_1.getBestUrl)(this.rpc[Number(chainId)])]; }))).then((results) => results.reduce((accumulator, [chainId, url]) => {
                accumulator[chainId] = url;
                return accumulator;
            }, {}));
            yield (this.eagerConnection = Promise.resolve().then(() => __importStar(require('@walletconnect/ethereum-provider'))).then((m) => __awaiter(this, void 0, void 0, function* () {
                this.provider = new m.default(Object.assign(Object.assign({}, this.options), { chainId, rpc: yield rpc }));
                this.provider.on('disconnect', this.disconnectListener);
                this.provider.on('chainChanged', this.chainChangedListener);
                this.provider.on('accountsChanged', this.accountsChangedListener);
                this.provider.connector.on('display_uri', this.URIListener);
            })));
        });
    }
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly() {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelActivation = this.actions.startActivation();
            yield this.isomorphicInitialize();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (this.provider.connected) {
                try {
                    // for walletconnect, we always use sequential instead of parallel fetches because otherwise
                    // chainId defaults to 1 even if the connecting wallet isn't on mainnet
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const accounts = yield this.provider.request({ method: 'eth_accounts' });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const chainId = parseChainId(yield this.provider.request({ method: 'eth_chainId' }));
                    console.log(accounts, chainId, 'here 11111');
                    if (accounts.length) {
                        this.actions.update({ chainId, accounts });
                    }
                    else {
                        throw new Error('No accounts returned');
                    }
                }
                catch (error) {
                    console.debug('Could not connect eagerly', error);
                    cancelActivation();
                }
            }
            else {
                cancelActivation();
            }
        });
    }
    /**
     * Initiates a connection.
     *
     * @param desiredChainId - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if their wallet supports it.
     */
    activate(desiredChainId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (desiredChainId && this.rpc[desiredChainId] === undefined) {
                throw new Error(`no url(s) provided for desiredChainId ${desiredChainId}`);
            }
            // this early return clause catches some common cases if we're already connected
            if ((_a = this.provider) === null || _a === void 0 ? void 0 : _a.connected) {
                if (!desiredChainId || desiredChainId === this.provider.chainId)
                    return;
                const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;
                return this.provider
                    .request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: desiredChainIdHex }],
                })
                    .catch(() => void 0);
            }
            this.actions.startActivation();
            // if we're trying to connect to a specific chain that we're not already initialized for, we have to re-initialize
            if (desiredChainId && desiredChainId !== ((_b = this.provider) === null || _b === void 0 ? void 0 : _b.chainId))
                yield this.deactivate();
            yield this.isomorphicInitialize(desiredChainId);
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const accounts = yield this.provider.request({ method: 'eth_requestAccounts' });
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const chainId = parseChainId(yield this.provider.request({ method: 'eth_chainId' }));
                if (!desiredChainId || desiredChainId === chainId) {
                    return this.actions.update({ chainId, accounts });
                }
                // because e.g. metamask doesn't support wallet_switchEthereumChain, we have to report connections,
                // even if the chainId isn't necessarily the desired one. this is ok because in e.g. rainbow,
                // we won't report a connection to the wrong chain while the switch is pending because of the re-initialization
                // logic above, which ensures first-time connections are to the correct chain in the first place
                this.actions.update({ chainId, accounts });
                // if we're here, we can try to switch networks, ignoring errors
                const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;
                return (_c = this.provider) === null || _c === void 0 ? void 0 : _c.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: desiredChainIdHex }],
                }).catch(() => void 0);
            }
            catch (error) {
                // this condition is a bit of a hack :/
                // if a user triggers the walletconnect modal, closes it, and then tries to connect again,
                // the modal will not trigger. the logic below prevents this from happening
                if (error.message === 'User closed modal') {
                    yield this.deactivate(this.treatModalCloseAsError ? error : undefined);
                }
                else {
                    this.actions.reportError(error);
                }
            }
        });
    }
    /** {@inheritdoc Connector.deactivate} */
    deactivate(error) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.provider) === null || _a === void 0 ? void 0 : _a.off('disconnect', this.disconnectListener);
            (_b = this.provider) === null || _b === void 0 ? void 0 : _b.off('chainChanged', this.chainChangedListener);
            (_c = this.provider) === null || _c === void 0 ? void 0 : _c.off('accountsChanged', this.accountsChangedListener);
            (_e = (_d = this.provider) === null || _d === void 0 ? void 0 : _d.connector) === null || _e === void 0 ? void 0 : _e.off('display_uri', this.URIListener);
            yield ((_f = this.provider) === null || _f === void 0 ? void 0 : _f.disconnect());
            this.provider = undefined;
            this.eagerConnection = undefined;
            this.actions.reportError(error);
        });
    }
}
exports.WalletConnect = WalletConnect;
