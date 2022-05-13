import * as React from 'preact/compat';
import { TextMap } from '../types';
interface DesktopLinkProps {
    wcUri: string;
    text: TextMap;
}
declare function DesktopLink({ wcUri, text }: DesktopLinkProps): React.JSX.Element;
export default DesktopLink;
