import type { Actions } from '@web3-react/types';
import { Connector } from '@web3-react/types';
export declare class NoFrameError extends Error {
    constructor();
}
interface FrameConnectorArguments {
    infuraId?: string;
    alchemyId?: string;
    origin?: string;
}
export declare class Frame extends Connector {
    private readonly options?;
    private providerPromise?;
    constructor(actions: Actions, options?: FrameConnectorArguments, connectEagerly?: boolean);
    private startListening;
    activate(): Promise<void>;
}
export {};
