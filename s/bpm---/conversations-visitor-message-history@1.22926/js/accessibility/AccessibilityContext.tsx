import { createContext, useContext, useState } from 'react';
import { OverlayProvider } from '@react-aria/overlays';
import { jsx as _jsx } from "react/jsx-runtime";
export const defaultValue = {
  shouldTrapFocus: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setShouldTrapFocus: shouldTrapFocus => {},
  isMessageEditorFocused: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsMessageEditorFocused: isMessageEditorFocused => {},
  launcherRef: null,
  setLauncherRef: () => {},
  disableAutoFocus: false,
  disableWidgetClose: false,
  disableWidgetDialog: false
};
export const AccessibilityContext = /*#__PURE__*/createContext(defaultValue);
export const AccessibilityContextProvider = ({
  children,
  disableFocusTrap = false,
  disableAutoFocus = false,
  disableWidgetClose = false,
  disableWidgetDialog = false
}) => {
  const [shouldTrapFocus, setShouldTrapFocus] = useState(false);
  const [isMessageEditorFocused, setIsMessageEditorFocused] = useState(false);
  const [launcherRef, setLauncherRef] = useState(defaultValue.launcherRef);
  return /*#__PURE__*/_jsx(AccessibilityContext.Provider, {
    value: {
      isMessageEditorFocused,
      setIsMessageEditorFocused,
      launcherRef,
      setLauncherRef: setLauncherRef,
      shouldTrapFocus,
      setShouldTrapFocus: disableFocusTrap ? defaultValue.setShouldTrapFocus : setShouldTrapFocus,
      disableAutoFocus,
      disableWidgetClose,
      disableWidgetDialog
    },
    children: /*#__PURE__*/_jsx(OverlayProvider, {
      style: {
        height: '100%'
      },
      children: children
    })
  });
};
AccessibilityContextProvider.displayName = 'AccessibilityContextProvider';
export const useAccessibilityContext = () => useContext(AccessibilityContext);