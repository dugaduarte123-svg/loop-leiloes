import { createContext, useContext } from 'react';
export const DETACHED_WINDOW_QUERY_PARAM = 'detachedWindow';
const defaultContextValue = {
  isDetachedWindow: false,
  isDetached: false,
  detachedWindowError: '',
  toggleDetachedWindow: () => {},
  closeDetachedWindow: () => {},
  focusDetachedWindow: () => {},
  clearDetachedWindowError: () => {},
  isDetachEnabled: false
};
export const DEFAULT_DETACHED_WINDOW_CONTEXT_VALUE = defaultContextValue;
export const DetachedWindowContext = /*#__PURE__*/createContext(defaultContextValue);
export const useDetachedWindow = () => useContext(DetachedWindowContext);