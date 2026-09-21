import styled from 'styled-components';
import { useAccessibilityContext } from 'conversations-visitor-message-history/accessibility/AccessibilityContext';
import { useRef } from 'react';
import { useOverlay } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { HEADER_TEXT_DESCRIPTION_ID, HEADER_TEXT_TITLE_ID } from 'conversations-visitor-experience-components/visitor-widget/constants/textIds';
import { useDetachedWindow } from 'conversations-visitor-experience-components/contexts/DetachedWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
const Main = styled.div.withConfig({
  displayName: "DialogWindow__Main"
})(["width:", ";&:focus{outline:none;}"], ({
  isDetached
}) => isDetached ? '100%' : 'auto');
const DialogWindow = props => {
  const {
    isOpen,
    onClose,
    children
  } = props;
  const {
    isDetached
  } = useDetachedWindow();
  const ref = useRef(null);
  const {
    dialogProps
  } = useDialog({
    id: 'live-chat-widget',
    'aria-labelledby': HEADER_TEXT_TITLE_ID,
    'aria-describedby': HEADER_TEXT_DESCRIPTION_ID
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  ref);
  const {
    setShouldTrapFocus,
    disableWidgetClose,
    launcherRef
  } = useAccessibilityContext();
  const {
    overlayProps
  } = useOverlay({
    isOpen,
    isKeyboardDismissDisabled: disableWidgetClose,
    onClose: () => {
      if (onClose) onClose();
      if (launcherRef) {
        launcherRef.focus();
      }
    },
    shouldCloseOnBlur: true,
    shouldCloseOnInteractOutside: element => {
      const isLauncherButton = element ? element.tagName === 'BUTTON' : false;
      // Un-trap focus when interacting with anything outside the widget window other than the launcher button
      if (!isLauncherButton) {
        setShouldTrapFocus(false);
      }
      return false;
    }
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  ref);
  return /*#__PURE__*/_jsx(Main, Object.assign({
    ref: ref,
    isDetached: isDetached
  }, overlayProps, dialogProps, {
    onClick: () => setShouldTrapFocus(true),
    children: children
  }));
};
DialogWindow.displayName = 'DialogWindow';
export default DialogWindow;