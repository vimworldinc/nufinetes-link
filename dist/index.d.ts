/// <reference types="node" />
import type WalletConnectProvider from '@walletconnect/ethereum-provider';
import type { IWCEthRpcConnectionOptions } from '@walletconnect/types';
import type { Actions, AddEthereumChainParameter } from '@web3-react/types';
import { Connector } from '@web3-react/types';
import EventEmitter3 from 'eventemitter3';
import type { EventEmitter } from 'node:events';
export declare const URI_AVAILABLE = "URI_AVAILABLE";
declare type MockWalletConnectProvider = WalletConnectProvider & EventEmitter & {
    createSession: () => Promise<void>;
    killSession: () => void;
    uri: string;
};
declare type WalletConnectOptions = Omit<IWCEthRpcConnectionOptions, 'rpc' | 'infuraId' | 'chainId'> & {
    rpc: {
        [chainId: number]: string | string[];
    };
};
export declare class NufinetesConnector extends Connector {
    /** {@inheritdoc Connector.provider} */
    provider: MockWalletConnectProvider | undefined;
    readonly events: EventEmitter3<string | symbol, any>;
    private readonly options;
    private readonly rpc;
    private eagerConnection?;
    private treatModalCloseAsError;
    /**
     * @param options - Options to pass to `@walletconnect/ethereum-provider`
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     */
    constructor(actions: Actions, options: WalletConnectOptions, connectEagerly?: boolean, treatModalCloseAsError?: boolean);
    private disconnectListener;
    private sessionListener;
    private modalClosingListener;
    private URIListener;
    private isomorphicInitialize;
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly(): Promise<void>;
    /**
     * Initiates a connection.
     *
     * @param desiredChainId - If defined, indicates the desired chain to connect to. If the user is
     * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
     * to the chain, if their wallet supports it.
     */
    activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void>;
    /** {@inheritdoc Connector.deactivate} */
    deactivate(error?: Error): Promise<void>;
}
export {};
