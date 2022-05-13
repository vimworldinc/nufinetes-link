import * as React from 'preact/compat';
import { TextMap } from '../types';
interface QRCodeDisplayProps {
    text: TextMap;
    uri: string;
}
declare function QRCodeDisplay(props: QRCodeDisplayProps): React.JSX.Element;
export default QRCodeDisplay;
