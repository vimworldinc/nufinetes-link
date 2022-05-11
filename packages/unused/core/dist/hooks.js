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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriorityConnector = exports.getSelectedConnector = exports.initializeConnector = void 0;
const store_1 = require("@web3-react/store");
const react_1 = require("react");
const zustand_1 = __importDefault(require("zustand"));
/**
 * Wraps the initialization of a `connector`. Creates a zustand `store` with `actions` bound to it, and then passes
 * these to the connector as specified in `f`. Also creates a variety of `hooks` bound to this `store`.
 *
 * @typeParam T - The type of the `connector` returned from `f`.
 * @param f - A function which is called with `actions` bound to the returned `store`.
 * @param allowedChainIds - An optional array of chainIds which the `connector` may connect to. If the `connector` is
 * connected to a chainId which is not allowed, a ChainIdNotAllowedError error will be reported.
 * If this argument is unspecified, the `connector` may connect to any chainId.
 * @returns [connector, hooks, store] - The initialized connector, a variety of hooks, and a zustand store.
 */
function initializeConnector(f, allowedChainIds) {
    const [store, actions] = (0, store_1.createWeb3ReactStoreAndActions)(allowedChainIds);
    const connector = f(actions);
    const useConnector = (0, zustand_1.default)(store);
    const stateHooks = getStateHooks(useConnector);
    const derivedHooks = getDerivedHooks(stateHooks);
    const augmentedHooks = getAugmentedHooks(connector, stateHooks, derivedHooks);
    return [connector, Object.assign(Object.assign(Object.assign({}, stateHooks), derivedHooks), augmentedHooks), store];
}
exports.initializeConnector = initializeConnector;
function computeIsActive({ chainId, accounts, activating, error }) {
    return Boolean(chainId && accounts && !activating && !error);
}
/**
 * Creates a variety of convenience `hooks` that return data associated with a particular passed connector.
 *
 * @param initializedConnectors - Two or more [connector, hooks(, store)] arrays, as returned from initializeConnector.
 * @returns hooks - A variety of convenience hooks that wrap the hooks returned from initializeConnector.
 */
function getSelectedConnector(...initializedConnectors) {
    function getIndex(connector) {
        const index = initializedConnectors.findIndex(([initializedConnector]) => connector === initializedConnector);
        if (index === -1)
            throw new Error('Connector not found');
        return index;
    }
    function useSelectedStore(connector) {
        const store = initializedConnectors[getIndex(connector)][2];
        if (!store)
            throw new Error('Stores not passed');
        return store;
    }
    // the following code calls hooks in a map a lot, which violates the eslint rule.
    // this is ok, though, because initializedConnectors never changes, so the same hooks are called each time
    function useSelectedChainId(connector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useChainId }]) => useChainId());
        return values[getIndex(connector)];
    }
    function useSelectedAccounts(connector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useAccounts }]) => useAccounts());
        return values[getIndex(connector)];
    }
    function useSelectedIsActivating(connector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useIsActivating }]) => useIsActivating());
        return values[getIndex(connector)];
    }
    function useSelectedError(connector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useError }]) => useError());
        return values[getIndex(connector)];
    }
    function useSelectedAccount(connector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useAccount }]) => useAccount());
        return values[getIndex(connector)];
    }
    function useSelectedIsActive(connector) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useIsActive }]) => useIsActive());
        return values[getIndex(connector)];
    }
    /**
     * @typeParam T - A type argument must only be provided if one or more of the connectors passed to
     * getSelectedConnector is using `connector.customProvider`, in which case it must match every possible type of this
     * property, over all connectors.
     */
    function useSelectedProvider(connector, network) {
        const index = getIndex(connector);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useProvider }], i) => useProvider(network, i === index));
        return values[index];
    }
    function useSelectedENSNames(connector, provider) {
        const index = getIndex(connector);
        const values = initializedConnectors.map(([, { useENSNames }], i) => 
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useENSNames(i === index ? provider : undefined));
        return values[index];
    }
    function useSelectedENSName(connector, provider) {
        const index = getIndex(connector);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useENSName }], i) => useENSName(i === index ? provider : undefined));
        return values[index];
    }
    return {
        useSelectedStore,
        useSelectedChainId,
        useSelectedAccounts,
        useSelectedIsActivating,
        useSelectedError,
        useSelectedAccount,
        useSelectedIsActive,
        useSelectedProvider,
        useSelectedENSNames,
        useSelectedENSName,
    };
}
exports.getSelectedConnector = getSelectedConnector;
/**
 * Creates a variety of convenience `hooks` that return data associated with the first of the `initializedConnectors`
 * that is active.
 *
 * @param initializedConnectors - Two or more [connector, hooks(, store)] arrays, as returned from initializeConnector.
 * @returns hooks - A variety of convenience hooks that wrap the hooks returned from initializeConnector.
 */
function getPriorityConnector(...initializedConnectors) {
    const { useSelectedStore, useSelectedChainId, useSelectedAccounts, useSelectedIsActivating, useSelectedError, useSelectedAccount, useSelectedIsActive, useSelectedProvider, useSelectedENSNames, useSelectedENSName, } = getSelectedConnector(...initializedConnectors);
    function usePriorityConnector() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const values = initializedConnectors.map(([, { useIsActive }]) => useIsActive());
        const index = values.findIndex((isActive) => isActive);
        return initializedConnectors[index === -1 ? 0 : index][0];
    }
    function usePriorityStore() {
        return useSelectedStore(usePriorityConnector());
    }
    function usePriorityChainId() {
        return useSelectedChainId(usePriorityConnector());
    }
    function usePriorityAccounts() {
        return useSelectedAccounts(usePriorityConnector());
    }
    function usePriorityIsActivating() {
        return useSelectedIsActivating(usePriorityConnector());
    }
    function usePriorityError() {
        return useSelectedError(usePriorityConnector());
    }
    function usePriorityAccount() {
        return useSelectedAccount(usePriorityConnector());
    }
    function usePriorityIsActive() {
        return useSelectedIsActive(usePriorityConnector());
    }
    /**
     * @typeParam T - A type argument must only be provided if one or more of the connectors passed to
     * getPriorityConnector is using `connector.customProvider`, in which case it must match every possible type of this
     * property, over all connectors.
     */
    function usePriorityProvider(network) {
        return useSelectedProvider(usePriorityConnector(), network);
    }
    function usePriorityENSNames(provider) {
        return useSelectedENSNames(usePriorityConnector(), provider);
    }
    function usePriorityENSName(provider) {
        return useSelectedENSName(usePriorityConnector(), provider);
    }
    return {
        useSelectedStore,
        useSelectedChainId,
        useSelectedAccounts,
        useSelectedIsActivating,
        useSelectedError,
        useSelectedAccount,
        useSelectedIsActive,
        useSelectedProvider,
        useSelectedENSNames,
        useSelectedENSName,
        usePriorityConnector,
        usePriorityStore,
        usePriorityChainId,
        usePriorityAccounts,
        usePriorityIsActivating,
        usePriorityError,
        usePriorityAccount,
        usePriorityIsActive,
        usePriorityProvider,
        usePriorityENSNames,
        usePriorityENSName,
    };
}
exports.getPriorityConnector = getPriorityConnector;
const CHAIN_ID = ({ chainId }) => chainId;
const ACCOUNTS = ({ accounts }) => accounts;
const ACCOUNTS_EQUALITY_CHECKER = (oldAccounts, newAccounts) => (oldAccounts === undefined && newAccounts === undefined) ||
    (oldAccounts !== undefined &&
        oldAccounts.length === (newAccounts === null || newAccounts === void 0 ? void 0 : newAccounts.length) &&
        oldAccounts.every((oldAccount, i) => oldAccount === newAccounts[i]));
const ACTIVATING = ({ activating }) => activating;
const ERROR = ({ error }) => error;
function getStateHooks(useConnector) {
    function useChainId() {
        return useConnector(CHAIN_ID);
    }
    function useAccounts() {
        return useConnector(ACCOUNTS, ACCOUNTS_EQUALITY_CHECKER);
    }
    function useIsActivating() {
        return useConnector(ACTIVATING);
    }
    function useError() {
        return useConnector(ERROR);
    }
    return { useChainId, useAccounts, useIsActivating, useError };
}
function getDerivedHooks({ useChainId, useAccounts, useIsActivating, useError }) {
    function useAccount() {
        var _a;
        return (_a = useAccounts()) === null || _a === void 0 ? void 0 : _a[0];
    }
    function useIsActive() {
        const chainId = useChainId();
        const accounts = useAccounts();
        const activating = useIsActivating();
        const error = useError();
        return computeIsActive({
            chainId,
            accounts,
            activating,
            error,
        });
    }
    return { useAccount, useIsActive };
}
function useENS(provider, accounts) {
    const [ENSNames, setENSNames] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        if (provider && (accounts === null || accounts === void 0 ? void 0 : accounts.length)) {
            let stale = false;
            Promise.all(accounts.map((account) => provider.lookupAddress(account)))
                .then((ENSNames) => {
                if (!stale) {
                    setENSNames(ENSNames);
                }
            })
                .catch((error) => {
                console.debug('Could not fetch ENS names', error);
            });
            return () => {
                stale = true;
                setENSNames(undefined);
            };
        }
    }, [provider, accounts]);
    return ENSNames;
}
function getAugmentedHooks(connector, { useAccounts }, { useAccount, useIsActive }) {
    /**
     * Avoid type erasure by returning the most qualified type if not otherwise set.
     * Note that this function's return type is `T | undefined`, but there is a code path
     * that returns a Web3Provider, which could conflict with a user-provided T. So,
     * it's important that users only provide an override for T if they know that
     * `connector.customProvider` is going to be defined and of type T.
     *
     * @typeParam T - A type argument must only be provided if using `connector.customProvider`, in which case it
     * must match the type of this property.
     */
    function useProvider(network, enabled = true) {
        const isActive = useIsActive();
        // trigger the dynamic import on mount
        // we store the class in an object and then destructure to avoid a compiler error related to class instantiation
        const [{ DynamicWeb3Provider }, setDynamicWeb3Provider] = (0, react_1.useState)({
            DynamicWeb3Provider: undefined,
        });
        (0, react_1.useEffect)(() => {
            Promise.resolve().then(() => __importStar(require('@ethersproject/providers'))).then(({ Web3Provider }) => setDynamicWeb3Provider({ DynamicWeb3Provider: Web3Provider }))
                .catch(() => {
                console.debug('@ethersproject/providers not available');
            });
        }, []);
        return (0, react_1.useMemo)(() => {
            // to ensure connectors remain fresh after network changes, we use isActive here to ensure re-renders
            if (DynamicWeb3Provider && enabled && isActive) {
                if (connector.customProvider)
                    return connector.customProvider;
                // see tsdoc note above for return type explanation.
                if (connector.provider)
                    return new DynamicWeb3Provider(connector.provider, network);
            }
        }, [DynamicWeb3Provider, enabled, isActive, network]);
    }
    function useENSNames(provider) {
        const accounts = useAccounts();
        return useENS(provider, accounts);
    }
    function useENSName(provider) {
        var _a;
        const account = useAccount();
        const accounts = (0, react_1.useMemo)(() => (account === undefined ? undefined : [account]), [account]);
        return (_a = useENS(provider, accounts)) === null || _a === void 0 ? void 0 : _a[0];
    }
    return { useProvider, useENSNames, useENSName };
}
