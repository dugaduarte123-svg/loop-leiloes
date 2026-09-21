import { REQUEST_WIDGET } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
import { isDetachedWindow } from '../query-params/isDetachedWindow';
export const handleRequestWidget = () => postMessageToParent(REQUEST_WIDGET, isDetachedWindow() ? {
  isDetachedVisitor: true
} : undefined);