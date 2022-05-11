import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
import type { LoginWithMagicLinkConfiguration, Magic as MagicInstance, MagicSDKAdditionalConfiguration } from 'magic-sdk';
export interface MagicConnectorArguments extends MagicSDKAdditionalConfiguration {
    apiKey: string;
}
export declare class Magic extends Connector {
    private readonly options;
    magic?: MagicInstance;
    constructor(actions: Actions, options: MagicConnectorArguments);
    private startListening;
    activate(configuration: LoginWithMagicLinkConfiguration): Promise<void>;
}
