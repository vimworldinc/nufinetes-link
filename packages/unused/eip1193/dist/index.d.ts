import type { Actions, Provider } from '@web3-react/types';
import { Connector } from '@web3-react/types';
export declare class EIP1193 extends Connector {
    /** {@inheritdoc Connector.provider} */
    provider: Provider;
    /**
     * @param provider - An EIP-1193 ({@link https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md}) provider.
     * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
     */
    constructor(actions: Actions, provider: Provider, connectEagerly?: boolean);
    /** {@inheritdoc Connector.connectEagerly} */
    connectEagerly(): Promise<void>;
    /** {@inheritdoc Connector.activate} */
    activate(): Promise<void>;
}
