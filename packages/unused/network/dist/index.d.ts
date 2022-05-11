import type { FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';
import type { ConnectionInfo } from '@ethersproject/web';
import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
declare type url = string | ConnectionInfo;
export declare class Network extends Connector {
    /** {@inheritdoc Connector.provider} */
    readonly provider: undefined;
    /** {@inheritdoc Connector.customProvider} */
    customProvider: JsonRpcProvider | FallbackProvider | undefined;
    private readonly urlMap;
    private readonly defaultChainId;
    private readonly providerCache;
    /**
     * @param urlMap - A mapping from chainIds to RPC urls.
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     * @param defaultChainId - The chainId to connect to if connectEagerly is true.
     */
    constructor(actions: Actions, urlMap: {
        [chainId: number]: url | url[] | JsonRpcProvider | JsonRpcProvider[] | FallbackProvider;
    }, connectEagerly?: boolean, defaultChainId?: number);
    private isomorphicInitialize;
    /**
     * Initiates a connection.
     *
     * @param desiredChainId - The desired chain to connect to.
     */
    activate(desiredChainId?: number): Promise<void>;
}
export {};
