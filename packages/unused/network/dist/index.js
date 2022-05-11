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
exports.Network = void 0;
const types_1 = require("@web3-react/types");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUrl(url) {
    return typeof url === 'string' || ('url' in url && !('connection' in url) && !('quorum' in url));
}
function isJsonRpcProvider(url) {
    return !isUrl(url) && 'connection' in url && !('quorum' in url);
}
function isFallbackProvider(url) {
    return !isUrl(url) && 'quorum' in url && !('connection' in url);
}
class Network extends types_1.Connector {
    /**
     * @param urlMap - A mapping from chainIds to RPC urls.
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     * @param defaultChainId - The chainId to connect to if connectEagerly is true.
     */
    constructor(actions, urlMap, connectEagerly = false, defaultChainId = Number(Object.keys(urlMap)[0])) {
        super(actions);
        this.providerCache = {};
        if (connectEagerly && typeof window === 'undefined') {
            throw new Error('connectEagerly = true is invalid for SSR, instead use the activate method in a useEffect');
        }
        this.urlMap = Object.keys(urlMap).reduce((accumulator, chainId) => {
            const urls = urlMap[Number(chainId)];
            if (Array.isArray(urls)) {
                accumulator[Number(chainId)] = urls;
            }
            else {
                accumulator[Number(chainId)] = isFallbackProvider(urls) ? urls : isJsonRpcProvider(urls) ? [urls] : [urls];
            }
            return accumulator;
        }, {});
        this.defaultChainId = defaultChainId;
        if (connectEagerly)
            void this.activate();
    }
    isomorphicInitialize(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.providerCache[chainId])
                return this.providerCache[chainId];
            const urls = this.urlMap[chainId];
            if (Array.isArray(urls)) {
                // early return if we have a single jsonrpc provider already
                if (urls.length === 1 && isJsonRpcProvider(urls[0]))
                    return (this.providerCache[chainId] = Promise.resolve(urls[0]));
            }
            else {
                // if we're here we know urls is a FallbackProvider
                return (this.providerCache[chainId] = Promise.resolve(urls));
            }
            return (this.providerCache[chainId] = Promise.resolve().then(() => __importStar(require('@ethersproject/providers'))).then(({ JsonRpcProvider, FallbackProvider }) => ({
                JsonRpcProvider,
                FallbackProvider,
            }))
                .then(({ JsonRpcProvider, FallbackProvider }) => {
                const providers = urls.map((url) => (isUrl(url) ? new JsonRpcProvider(url, chainId) : url));
                return providers.length === 1 ? providers[0] : new FallbackProvider(providers);
            }));
        });
    }
    /**
     * Initiates a connection.
     *
     * @param desiredChainId - The desired chain to connect to.
     */
    activate(desiredChainId = this.defaultChainId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.customProvider)
                this.actions.startActivation();
            yield this.isomorphicInitialize(desiredChainId)
                .then((customProvider) => __awaiter(this, void 0, void 0, function* () {
                this.customProvider = customProvider;
                const { chainId } = yield this.customProvider.getNetwork();
                this.actions.update({ chainId, accounts: [] });
            }))
                .catch((error) => {
                this.actions.reportError(error);
            });
        });
    }
}
exports.Network = Network;
