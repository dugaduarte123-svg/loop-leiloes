import WidgetErrorRetryPanel from './WidgetErrorRetryPanel';
import AsyncComponentErrorBoundary from '../code-splitting/AsyncComponentErrorBoundary';
import CurrentViewContainer from '../current-view/CurrentViewContainer';
import { useAccessibilityContext } from 'conversations-visitor-message-history/accessibility/AccessibilityContext';
import { Fragment } from 'react';
import { NavMarker } from 'react-rhumb';
import DialogWindow from './DialogWindow';
import { jsx as _jsx } from "react/jsx-runtime";
const WidgetWindow = props => {
  const {
    inline,
    isOpen,
    shouldRenderDialog,
    mobile,
    widgetLocation,
    onClose,
    onOpenAnimationStarted,
    onCloseAnimationFinished,
    onOpenAnimationFinished,
    onCloseAnimationStarted,
    usePillLauncher,
    onSetMessageTextExternally
  } = props;
  const {
    disableWidgetDialog
  } = useAccessibilityContext();
  const getDialogConfig = () => {
    if (disableWidgetDialog) {
      return {
        Wrapper: Fragment,
        props: {}
      };
    }
    if (!shouldRenderDialog) {
      return {
        Wrapper: Fragment,
        props: {}
      };
    }
    return {
      Wrapper: DialogWindow,
      props: {
        isOpen,
        onClose
      }
    };
  };
  const {
    Wrapper,
    props: wrapperProps
  } = getDialogConfig();
  return /*#__PURE__*/_jsx(Wrapper, Object.assign({}, wrapperProps, {
    children: /*#__PURE__*/_jsx(AsyncComponentErrorBoundary, {
      renderError: retry => /*#__PURE__*/_jsx(NavMarker, {
        name: "ERROR_WITH_RETRY",
        children: /*#__PURE__*/_jsx(WidgetErrorRetryPanel, {
          inline: inline,
          isOpen: isOpen,
          mobile: mobile,
          widgetLocation: widgetLocation,
          onClose: onClose,
          retry: retry
        })
      }),
      children: /*#__PURE__*/_jsx(CurrentViewContainer, {
        inline: inline,
        isOpen: isOpen,
        onOpenAnimationStarted: onOpenAnimationStarted,
        onCloseAnimationFinished: onCloseAnimationFinished,
        onOpenAnimationFinished: onOpenAnimationFinished,
        onCloseAnimationStarted: onCloseAnimationStarted,
        closeWidget: onClose,
        usePillLauncher: usePillLauncher,
        onSetMessageTextExternally: onSetMessageTextExternally
      })
    })
  }));
};
WidgetWindow.displayName = 'WidgetWindow';
export default WidgetWindow;