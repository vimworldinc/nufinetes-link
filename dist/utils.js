"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getBestUrl = void 0;
function getBestUrl(urls) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, HttpConnection, JsonRpcProvider;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // if we only have 1 url, it's the best!
                    if (urls.length === 1)
                        return [2 /*return*/, urls[0]];
                    return [4 /*yield*/, Promise.all([
                            Promise.resolve().then(function () { return require('@walletconnect/jsonrpc-http-connection'); }).then(function (_a) {
                                var HttpConnection = _a.HttpConnection;
                                return HttpConnection;
                            }),
                            Promise.resolve().then(function () { return require('@walletconnect/jsonrpc-provider'); }).then(function (_a) {
                                var JsonRpcProvider = _a.JsonRpcProvider;
                                return JsonRpcProvider;
                            }),
                        ])
                        // the below returns the first url for which there's been a successful call, prioritized by index
                    ];
                case 1:
                    _a = _b.sent(), HttpConnection = _a[0], JsonRpcProvider = _a[1];
                    // the below returns the first url for which there's been a successful call, prioritized by index
                    return [2 /*return*/, new Promise(function (resolve) {
                            var resolved = false;
                            var successes = {};
                            urls.forEach(function (url, i) {
                                var http = new JsonRpcProvider(new HttpConnection(url));
                                void http
                                    .request({ method: 'eth_chainId' })
                                    .then(function () { return true; })["catch"](function () { return false; })
                                    .then(function (success) {
                                    // if we already resolved, return
                                    if (resolved)
                                        return;
                                    // store the result of the call
                                    successes[i] = success;
                                    // if this is the last call and we haven't resolved yet - do so
                                    if (Object.keys(successes).length === urls.length) {
                                        var index = Object.keys(successes).findIndex(function (j) { return successes[Number(j)]; });
                                        // no need to set resolved to true, as this is the last promise
                                        return resolve(urls[index === -1 ? 0 : index]);
                                    }
                                    // otherwise, for each prospective index, check if we can resolve
                                    new Array(urls.length).fill(0).forEach(function (_, prospectiveIndex) {
                                        // to resolve, we need to:
                                        // a) have successfully made a call
                                        // b) not be waiting on any other higher-index calls
                                        if (successes[prospectiveIndex] &&
                                            new Array(prospectiveIndex).fill(0).every(function (_, j) { return successes[j] === false; })) {
                                            resolved = true;
                                            resolve(urls[prospectiveIndex]);
                                        }
                                    });
                                });
                            });
                        })];
            }
        });
    });
}
exports.getBestUrl = getBestUrl;
