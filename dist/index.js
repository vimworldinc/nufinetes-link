"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.__esModule = true;
exports.NufinetesConnector = exports.URI_AVAILABLE = void 0;
var qrmodal_1 = require("./qrmodal");
var types_1 = require("@web3-react/types");
var eventemitter3_1 = require("eventemitter3");
exports.URI_AVAILABLE = 'URI_AVAILABLE';
function parseChainId(chainId) {
    return typeof chainId === 'string' ? Number.parseInt(chainId) : chainId;
}
var NufinetesConnector = /** @class */ (function (_super) {
    __extends(NufinetesConnector, _super);
    /**
     * @param options - Options to pass to `@walletconnect/ethereum-provider`
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     */
    function NufinetesConnector(actions, options, connectEagerly, treatModalCloseAsError) {
        if (connectEagerly === void 0) { connectEagerly = false; }
        if (treatModalCloseAsError === void 0) { treatModalCloseAsError = true; }
        var _this = _super.call(this, actions) || this;
        _this.events = new eventemitter3_1["default"]();
        _this.disconnectListener = function (error) {
            _this.deactivate();
            _this.actions.reportError(error);
        };
        _this.sessionListener = function (_, payload) {
            try {
                var _a = payload.params[0], accounts = _a.accounts, chainId = _a.chainId;
                if (accounts.length) {
                    _this.actions.update({ chainId: parseChainId(chainId), accounts: accounts });
                }
                else {
                    throw new Error('No accounts returned');
                }
            }
            catch (error) {
                throw new Error('Error occurred');
            }
        };
        // private chainChangedListener = (chainId: number | string): void => {
        //   this.actions.update({ chainId: parseChainId(chainId) })
        // }
        // private accountsChangedListener = (accounts: string[]): void => {
        //   this.actions.update({ accounts })
        // }
        _this.modalClosingListener = function (error) {
            _this.provider = undefined;
            _this.customProvider = null;
            _this.eagerConnection = undefined;
            _this.actions.reportError(new Error('User closed modal'));
        };
        _this.URIListener = function (_, payload) {
            _this.events.emit(exports.URI_AVAILABLE, payload.params[0]);
        };
        if (connectEagerly && typeof window === 'undefined') {
            throw new Error('connectEagerly = true is invalid for SSR, instead use the connectEagerly method in a useEffect');
        }
        var rpc = options.rpc, rest = __rest(options, ["rpc"]);
        _this.rpc = Object.keys(rpc).reduce(function (accumulator, chainId) {
            var value = rpc[Number(chainId)];
            accumulator[Number(chainId)] = Array.isArray(value) ? value : [value];
            return accumulator;
        }, {});
        _this.options = rest;
        _this.treatModalCloseAsError = treatModalCloseAsError;
        if (connectEagerly)
            void _this.connectEagerly();
        return _this;
    }
    NufinetesConnector.prototype.isomorphicInitialize = function (chainId) {
        if (chainId === void 0) { chainId = Number(Object.keys(this.rpc)[0]); }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.eagerConnection)
                            return [2 /*return*/, this.eagerConnection
                                // because we can only use 1 url per chainId, we need to decide between multiple, where necessary
                                // const rpc = Promise.all(
                                //   Object.keys(this.rpc).map(
                                //     async (chainId): Promise<[number, string]> => [Number(chainId), await getBestUrl(this.rpc[Number(chainId)])]
                                //   )
                                // ).then((results) =>
                                //   results.reduce<{ [chainId: number]: string }>((accumulator, [chainId, url]) => {
                                //     accumulator[chainId] = url
                                //     return accumulator
                                //   }, {})
                                // )
                            ];
                        // because we can only use 1 url per chainId, we need to decide between multiple, where necessary
                        // const rpc = Promise.all(
                        //   Object.keys(this.rpc).map(
                        //     async (chainId): Promise<[number, string]> => [Number(chainId), await getBestUrl(this.rpc[Number(chainId)])]
                        //   )
                        // ).then((results) =>
                        //   results.reduce<{ [chainId: number]: string }>((accumulator, [chainId, url]) => {
                        //     accumulator[chainId] = url
                        //     return accumulator
                        //   }, {})
                        // )
                        return [4 /*yield*/, (this.eagerConnection = Promise.resolve().then(function () { return require('@walletconnect/client'); }).then(function (m) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    this.provider = new m["default"]({
                                        bridge: 'https://bridge.walletconnect.org',
                                        qrcodeModal: qrmodal_1["default"]
                                    });
                                    this.provider.on('connect', this.sessionListener);
                                    this.provider.on('session_update', this.sessionListener);
                                    this.provider.on('disconnect', this.disconnectListener);
                                    this.provider.on('modal_closed', this.modalClosingListener);
                                    // this.provider.on('chainChanged', this.chainChangedListener)
                                    // this.provider.on('accountsChanged', this.accountsChangedListener)
                                    this.customProvider = this.provider;
                                    return [2 /*return*/];
                                });
                            }); }))];
                    case 1:
                        // because we can only use 1 url per chainId, we need to decide between multiple, where necessary
                        // const rpc = Promise.all(
                        //   Object.keys(this.rpc).map(
                        //     async (chainId): Promise<[number, string]> => [Number(chainId), await getBestUrl(this.rpc[Number(chainId)])]
                        //   )
                        // ).then((results) =>
                        //   results.reduce<{ [chainId: number]: string }>((accumulator, [chainId, url]) => {
                        //     accumulator[chainId] = url
                        //     return accumulator
                        //   }, {})
                        // )
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** {@inheritdoc Connector.connectEagerly} */
    NufinetesConnector.prototype.connectEagerly = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cancelActivation, accounts, chainId, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        cancelActivation = this.actions.startActivation();
                        return [4 /*yield*/, this.isomorphicInitialize()
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        ];
                    case 1:
                        _b.sent();
                        if (!this.provider.connected) return [3 /*break*/, 7];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, this.provider.accounts
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        ];
                    case 3:
                        accounts = _b.sent();
                        _a = parseChainId;
                        return [4 /*yield*/, this.provider.chainId];
                    case 4:
                        chainId = _a.apply(void 0, [_b.sent()]);
                        if (accounts.length) {
                            this.actions.update({ chainId: chainId, accounts: accounts });
                        }
                        else {
                            throw new Error('No accounts returned');
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        console.debug('Could not connect eagerly', error_1);
                        cancelActivation();
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        cancelActivation();
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Initiates a connection.
     *
     * @param desiredChainId - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if their wallet supports it.
     */
    NufinetesConnector.prototype.activate = function (desiredChainIdOrChainParameters) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var desiredChainId, desiredChainIdHex, accounts, chainId, _d, error_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        desiredChainId = typeof desiredChainIdOrChainParameters === 'number'
                            ? desiredChainIdOrChainParameters
                            : desiredChainIdOrChainParameters === null || desiredChainIdOrChainParameters === void 0 ? void 0 : desiredChainIdOrChainParameters.chainId;
                        if (desiredChainId && this.rpc[desiredChainId] === undefined) {
                            throw new Error("no url(s) provided for desiredChainId " + desiredChainId);
                        }
                        // this early return clause catches some common cases if we're already connected
                        if ((_a = this.provider) === null || _a === void 0 ? void 0 : _a.connected) {
                            if (!desiredChainId || desiredChainId === this.provider.chainId)
                                return [2 /*return*/];
                            desiredChainIdHex = "0x" + desiredChainId.toString(16);
                            return [2 /*return*/, this.provider
                                    .request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: desiredChainIdHex }]
                                })["catch"](function () { return void 0; })];
                        }
                        this.actions.startActivation();
                        if (!(desiredChainId && desiredChainId !== ((_b = this.provider) === null || _b === void 0 ? void 0 : _b.chainId))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.deactivate()];
                    case 1:
                        _e.sent();
                        _e.label = 2;
                    case 2: return [4 /*yield*/, this.isomorphicInitialize(desiredChainId)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 9, , 13]);
                        if (!((_c = this.provider) === null || _c === void 0 ? void 0 : _c.connected)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.provider.accounts
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        ];
                    case 5:
                        accounts = _e.sent();
                        _d = parseChainId;
                        return [4 /*yield*/, this.provider.chainId];
                    case 6:
                        chainId = _d.apply(void 0, [_e.sent()]);
                        if (!desiredChainId || desiredChainId === chainId) {
                            return [2 /*return*/, this.actions.update({ chainId: chainId, accounts: accounts })];
                        }
                        // because e.g. metamask doesn't support wallet_switchEthereumChain, we have to report connections,
                        // even if the chainId isn't necessarily the desired one. this is ok because in e.g. rainbow,
                        // we won't report a connection to the wrong chain while the switch is pending because of the re-initialization
                        // logic above, which ensures first-time connections are to the correct chain in the first place
                        this.actions.update({ chainId: chainId, accounts: accounts });
                        _e.label = 7;
                    case 7: 
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return [4 /*yield*/, this.provider.createSession()
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        // const uri = this.provider!.uri
                        // QRCodeModal.open(uri)
                        // if we're here, we can try to switch networks, ignoring errors
                        // const desiredChainIdHex = `0x${desiredChainId.toString(16)}`
                        // return this.provider
                        //   ?.request<void>({
                        //     method: 'wallet_switchEthereumChain',
                        //     params: [{ chainId: desiredChainIdHex }],
                        //   })
                        //   .catch(() => void 0)
                    ];
                    case 8:
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        _e.sent();
                        return [3 /*break*/, 13];
                    case 9:
                        error_2 = _e.sent();
                        if (!(error_2.message === 'User closed modal')) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.deactivate(this.treatModalCloseAsError ? error_2 : undefined)];
                    case 10:
                        _e.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        this.actions.reportError(error_2);
                        _e.label = 12;
                    case 12: return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    /** {@inheritdoc Connector.deactivate} */
    NufinetesConnector.prototype.deactivate = function (error) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_f) {
                (_a = this.provider) === null || _a === void 0 ? void 0 : _a.off('disconnect', this.disconnectListener);
                (_b = this.provider) === null || _b === void 0 ? void 0 : _b.off('connect', this.sessionListener);
                (_c = this.provider) === null || _c === void 0 ? void 0 : _c.off('session_update', this.sessionListener);
                (_e = (_d = this.provider) === null || _d === void 0 ? void 0 : _d.connector) === null || _e === void 0 ? void 0 : _e.off('display_uri', this.URIListener);
                // await this.provider?.disconnect()
                // this.provider?.killSession()
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if (this.provider.connected) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.provider.killSession();
                }
                this.provider = undefined;
                this.eagerConnection = undefined;
                this.actions.reportError(error);
                return [2 /*return*/];
            });
        });
    };
    return NufinetesConnector;
}(types_1.Connector));
exports.NufinetesConnector = NufinetesConnector;
