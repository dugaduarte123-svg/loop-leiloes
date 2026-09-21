import { IFRAME_RESIZE, IFRAME_RESIZE_DRAG_EXPAND } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export const handleIframeResize = data => postMessageToParent(IFRAME_RESIZE, data);
export const expandIframeToViewportForDrag = data => postMessageToParent(IFRAME_RESIZE_DRAG_EXPAND, data);