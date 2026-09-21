import { LIGHTBOX_CLOSE, LIGHTBOX_OPEN } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';

/**
 * Notifies the host-page embed script (`WidgetShell`) to expand or restore
 * the widget iframe when the lightbox opens or closes.
 *
 * Because the widget runs inside an iframe, a `position: fixed` overlay inside
 * it is clipped to the iframe's viewport. Sending this message causes
 * `WidgetShell` to set the iframe and its container to `position: fixed; inset: 0`
 * so the lightbox overlay covers the full browser viewport.
 */
export const handleLightboxStateChange = isOpen => postMessageToParent(isOpen ? LIGHTBOX_OPEN : LIGHTBOX_CLOSE);