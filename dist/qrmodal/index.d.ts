import { IQRCodeModalOptions } from '@walletconnect/legacy-types';
declare function open(uri: string, cb: any, qrcodeModalOptions?: IQRCodeModalOptions): void;
declare function close(): void;
declare const _default: {
    open: typeof open;
    close: typeof close;
};
export default _default;