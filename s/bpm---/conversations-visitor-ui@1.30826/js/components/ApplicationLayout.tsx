import { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LauncherContainerWrapper from '../launcher/container/LauncherContainerWrapper';
import WidgetWindow from './WidgetWindow';
import { FocusScope } from '@react-aria/focus';
import { CANDY_APPLE } from 'visitor-ui-component-library/constants/WidgetColors';
import { AccessibilityContext } from 'conversations-visitor-message-history/accessibility/AccessibilityContext';
import { getUsePillLauncher, getUseSpotlightLauncher } from '../widget-data/selectors/widgetDataSelectors';
import { handleDragHandlePositionChange } from '../post-message/handleDragHandlePositionChange';
import WidgetWelcomePage from './WidgetWelcomePage';
import InitialPageContentWrapper from 'conversations-visitor-experience-components/visitor-widget/components/InitialPageContentWrapper';
import { CustomerAgentHoverProvider, useCustomerAgentHover } from 'conversations-visitor-experience-components/contexts/CustomerAgentHoverContext';
import { getInitialMessageForWelcomePage } from '../selectors/widgetDataSelectors/getInitialMessageForWelcomePage';
import { useDetachedLayoutBehavior } from './useDetachedLayoutBehavior';
import { SpotlightLayoutProvider } from 'conversations-visitor-experience-components/contexts/SpotlightLayoutContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const DetachedWindowError = styled.div.withConfig({
  displayName: "ApplicationLayout__DetachedWindowError"
})(["margin-top:8px;padding:8px 10px;border-radius:8px;color:", ";font-size:12px;"], CANDY_APPLE);
function ApplicationLayoutContent({
  inline,
  isOpen,
  mobile,
  showInitialMessageBubble,
  speechPocActive,
  toggleOpen,
  trackUserInteraction,
  widgetLocation,
  onSetMessageTextExternally
}) {
  const {
    isDetached,
    isHostingPopup,
    focusDetachedWindow,
    closeDetachedWindow,
    clearDetachedWindowError,
    resolveWidgetOpenWithDetach,
    resolveLauncherHiddenWithDetach,
    detachedWindowError
  } = useDetachedLayoutBehavior();
  const isWidgetOpen = resolveWidgetOpenWithDetach(isOpen);
  const [animationsFinished, setAnimationsFinished] = useState(true);
  const [shouldRenderDialog, setShouldRenderDialog] = useState(isWidgetOpen);
  const accessibilityContext = useContext(AccessibilityContext);
  const usePillLauncher = useSelector(getUsePillLauncher);
  const useSpotlightLauncher = useSelector(getUseSpotlightLauncher);
  const {
    resetHoverState
  } = useCustomerAgentHover();
  useEffect(() => {
    if (isWidgetOpen) {
      return;
    }
    if (useSpotlightLauncher) {
      handleDragHandlePositionChange({
        dragHandleState: 'hidden'
      });
      return;
    }
    const dragHandleState = usePillLauncher ? 'pill-launcher' : 'icon-launcher';
    handleDragHandlePositionChange({
      dragHandleState
    });
  }, [usePillLauncher, useSpotlightLauncher, isWidgetOpen]);
  const getLauncherOpenedFrom = () => {
    if (useSpotlightLauncher) return 'spotlight launcher';
    if (usePillLauncher) return 'pill launcher';
    return 'icon launcher';
  };
  const openWidget = () => {
    if (isDetached) {
      focusDetachedWindow();
      return;
    }
    clearDetachedWindowError();
    setAnimationsFinished(false);
    trackUserInteraction();
    toggleOpen({
      isOpened: true,
      isUser: true,
      openedFrom: getLauncherOpenedFrom()
    });
    accessibilityContext.setShouldTrapFocus(true);
  };
  const closeWidget = () => {
    if (isDetached) {
      closeDetachedWindow();
      return;
    }
    setAnimationsFinished(false);
    resetHoverState();
    trackUserInteraction();
    toggleOpen({
      isOpened: false,
      isUser: true
    });
  };
  const closeWidgetWelcomePage = () => {
    setAnimationsFinished(true);
    trackUserInteraction();
  };
  const onOpenAnimationStarted = () => {
    setAnimationsFinished(false);
    setShouldRenderDialog(true);
    if (usePillLauncher) {
      handleDragHandlePositionChange({
        dragHandleState: 'hidden'
      });
    }
  };
  const onOpenAnimationFinished = () => {
    setAnimationsFinished(true);
    accessibilityContext.setShouldTrapFocus(true);
    handleDragHandlePositionChange({
      dragHandleState: 'widget-open'
    });
  };
  const onCloseAnimationStarted = () => {
    setAnimationsFinished(false);
    if (usePillLauncher) {
      handleDragHandlePositionChange({
        dragHandleState: 'hidden'
      });
    }
  };
  const onCloseAnimationFinished = () => {
    setAnimationsFinished(true);
    setShouldRenderDialog(false);
    accessibilityContext.setShouldTrapFocus(false);
    handleDragHandlePositionChange({
      dragHandleState: useSpotlightLauncher ? 'hidden' : usePillLauncher ? 'pill-launcher' : 'icon-launcher'
    });
  };
  const onLauncherAnimationStart = () => {
    handleDragHandlePositionChange({
      dragHandleState: 'hidden'
    });
  };
  const onLauncherAnimationFinished = () => {
    handleDragHandlePositionChange({
      dragHandleState: 'pill-launcher'
    });
  };
  const baseLauncherHidden = isOpen && mobile || inline || isOpen && usePillLauncher;
  const isLauncherHidden = resolveLauncherHiddenWithDetach(baseLauncherHidden);
  const showContent = !usePillLauncher || usePillLauncher && animationsFinished;
  const initialMessage = useSelector(getInitialMessageForWelcomePage);
  return /*#__PURE__*/_jsx(AccessibilityContext.Consumer, {
    children: ({
      shouldTrapFocus,
      isMessageEditorFocused
    }) => /*#__PURE__*/_jsxs(FocusScope, {
      contain: shouldTrapFocus && !isMessageEditorFocused && !isHostingPopup,
      autoFocus: false,
      children: [/*#__PURE__*/_jsx(WidgetWindow, {
        inline: inline,
        isOpen: !isHostingPopup && (isWidgetOpen || inline),
        shouldRenderDialog: shouldRenderDialog,
        mobile: mobile,
        widgetLocation: widgetLocation,
        onOpenAnimationStarted: onOpenAnimationStarted,
        onCloseAnimationFinished: onCloseAnimationFinished,
        onOpenAnimationFinished: onOpenAnimationFinished,
        onCloseAnimationStarted: onCloseAnimationStarted,
        onClose: closeWidget,
        speechPocActive: speechPocActive,
        usePillLauncher: usePillLauncher,
        onSetMessageTextExternally: onSetMessageTextExternally
      }), showContent && !inline && (!isWidgetOpen || !usePillLauncher || isHostingPopup) && /*#__PURE__*/_jsxs(InitialPageContentWrapper, {
        isMobile: mobile,
        widgetLocation: widgetLocation,
        usePillLauncher: usePillLauncher,
        children: [showInitialMessageBubble && !isDetached && !isWidgetOpen && animationsFinished && /*#__PURE__*/_jsx(WidgetWelcomePage, {
          onClose: closeWidgetWelcomePage,
          initialMessage: initialMessage,
          isMobile: mobile
        }), !isLauncherHidden && /*#__PURE__*/_jsx(LauncherContainerWrapper, {
          onClose: closeWidget,
          onOpen: openWidget,
          usePillLauncher: usePillLauncher,
          useSpotlightLauncher: useSpotlightLauncher,
          onLauncherAnimationStart: onLauncherAnimationStart,
          onLauncherAnimationFinished: onLauncherAnimationFinished
        }), detachedWindowError && /*#__PURE__*/_jsx(DetachedWindowError, {
          "data-test-id": "detached-window-error",
          children: detachedWindowError
        })]
      })]
    })
  });
}
ApplicationLayoutContent.displayName = 'ApplicationLayoutContent';
export function ApplicationLayout(props) {
  const useSpotlightLauncher = useSelector(getUseSpotlightLauncher);
  const content = /*#__PURE__*/_jsx(CustomerAgentHoverProvider, {
    enableHoverTracking: false,
    children: /*#__PURE__*/_jsx(ApplicationLayoutContent, Object.assign({}, props))
  });
  if (useSpotlightLauncher) {
    return /*#__PURE__*/_jsx(SpotlightLayoutProvider, {
      children: content
    });
  }
  return content;
}
ApplicationLayout.displayName = 'ApplicationLayout';
export default ApplicationLayout;