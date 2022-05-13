import * as React from 'preact/compat';
import { IQRCodeModalOptions } from '@walletconnect/legacy-types';
import { TextMap } from '../types';
interface ModalProps {
    text: TextMap;
    uri: string;
    onClose: () => void;
    qrcodeModalOptions?: IQRCodeModalOptions;
}
declare function Modal(props: ModalProps): React.JSX.Element;
export default Modal;
