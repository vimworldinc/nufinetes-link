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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWeb3React = exports.Web3ReactProvider = void 0;
const react_1 = __importStar(require("react"));
const hooks_1 = require("./hooks");
const Web3Context = (0, react_1.createContext)(undefined);
function Web3ReactProvider({ children, connectors, connectorOverride, network, lookupENS = true, }) {
    const { usePriorityConnector, useSelectedChainId, useSelectedAccounts, useSelectedIsActivating, useSelectedError, useSelectedAccount, useSelectedIsActive, useSelectedProvider, useSelectedENSNames, useSelectedENSName, } = (0, hooks_1.getPriorityConnector)(...connectors);
    const priorityConnector = usePriorityConnector();
    const connector = connectorOverride !== null && connectorOverride !== void 0 ? connectorOverride : priorityConnector;
    const chainId = useSelectedChainId(connector);
    const accounts = useSelectedAccounts(connector);
    const isActivating = useSelectedIsActivating(connector);
    const error = useSelectedError(connector);
    const account = useSelectedAccount(connector);
    const isActive = useSelectedIsActive(connector);
    // note that we've omitted a <T extends BaseProvider = Web3Provider> generic type
    // in Web3ReactProvider, and thus can't pass T through to useSelectedProvider below.
    // this is because if we did so, the type of provider would include T, but that would
    // conflict because Web3Context can't take a generic. however, this isn't particularly
    // important, because useWeb3React (below) is manually typed
    const provider = useSelectedProvider(connector, network);
    const ENSNames = useSelectedENSNames(connector, lookupENS ? provider : undefined);
    const ENSName = useSelectedENSName(connector, lookupENS ? provider : undefined);
    return (react_1.default.createElement(Web3Context.Provider, { value: {
            connector,
            chainId,
            accounts,
            isActivating,
            error,
            account,
            isActive,
            provider,
            ENSNames,
            ENSName,
        } }, children));
}
exports.Web3ReactProvider = Web3ReactProvider;
function useWeb3React() {
    const web3 = (0, react_1.useContext)(Web3Context);
    if (!web3)
        throw Error('useWeb3React can only be used within the Web3ReactProvider component');
    return web3;
}
exports.useWeb3React = useWeb3React;
