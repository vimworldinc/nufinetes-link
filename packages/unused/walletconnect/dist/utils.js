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
exports.getBestUrl = void 0;
function getBestUrl(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        // if we only have 1 url, it's the best!
        if (urls.length === 1)
            return urls[0];
        const [HttpConnection, JsonRpcProvider] = yield Promise.all([
            Promise.resolve().then(() => __importStar(require('@walletconnect/jsonrpc-http-connection'))).then(({ HttpConnection }) => HttpConnection),
            Promise.resolve().then(() => __importStar(require('@walletconnect/jsonrpc-provider'))).then(({ JsonRpcProvider }) => JsonRpcProvider),
        ]);
        // the below returns the first url for which there's been a successful call, prioritized by index
        return new Promise((resolve) => {
            let resolved = false;
            const successes = {};
            urls.forEach((url, i) => {
                const http = new JsonRpcProvider(new HttpConnection(url));
                void http
                    .request({ method: 'eth_chainId' })
                    .then(() => true)
                    .catch(() => false)
                    .then((success) => {
                    // if we already resolved, return
                    if (resolved)
                        return;
                    // store the result of the call
                    successes[i] = success;
                    // if this is the last call and we haven't resolved yet - do so
                    if (Object.keys(successes).length === urls.length) {
                        const index = Object.keys(successes).findIndex((j) => successes[Number(j)]);
                        // no need to set resolved to true, as this is the last promise
                        return resolve(urls[index === -1 ? 0 : index]);
                    }
                    // otherwise, for each prospective index, check if we can resolve
                    new Array(urls.length).fill(0).forEach((_, prospectiveIndex) => {
                        // to resolve, we need to:
                        // a) have successfully made a call
                        // b) not be waiting on any other higher-index calls
                        if (successes[prospectiveIndex] &&
                            new Array(prospectiveIndex).fill(0).every((_, j) => successes[j] === false)) {
                            resolved = true;
                            resolve(urls[prospectiveIndex]);
                        }
                    });
                });
            });
        });
    });
}
exports.getBestUrl = getBestUrl;
