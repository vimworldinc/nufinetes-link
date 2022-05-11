import type { JsonRpcProvider } from '@ethersproject/providers';
import type { ConnectionInfo } from '@ethersproject/web';
import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
declare type url = string | ConnectionInfo;
export declare class Url extends Connector {
    /** {@inheritdoc Connector.provider} */
    readonly provider: undefined;
    /** {@inheritdoc Connector.customProvider} */
    customProvider: JsonRpcProvider | undefined;
    private eagerConnection?;
    private readonly url;
    /**
     * @param url - An RPC url or a JsonRpcProvider.
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     */
    constructor(actions: Actions, url: url | JsonRpcProvider, connectEagerly?: boolean);
    private isomorphicInitialize;
    /** {@inheritdoc Connector.activate} */
    activate(): Promise<void>;
}
export {};
