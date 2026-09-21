import FocusScopeWithContext from 'conversations-visitor-message-history/accessibility/FocusScopeWithContext';
import VisitorWidgetStyleWrapper from 'conversations-visitor-experience-components/presentation-components/VisitorWidgetStyleWrapper';
import I18n from 'I18n';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import VizExCloseButton from 'visitor-ui-component-library/button/VizExCloseButton';
import VizExLink from 'visitor-ui-component-library/link/VizExLink';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export const WidgetBodyDiv = styled.div.withConfig({
  displayName: "WidgetErrorRetryPanel__WidgetBodyDiv"
})(["display:flex;flex-direction:column;padding:40px;"]);
function WidgetErrorRetryPanel({
  inline,
  isOpen,
  mobile,
  onClose,
  retry,
  widgetLocation
}) {
  if (!isOpen) {
    return null;
  }
  return /*#__PURE__*/_jsx(FocusScopeWithContext, {
    children: /*#__PURE__*/_jsx("div", {
      role: "alert",
      children: /*#__PURE__*/_jsx(VisitorWidgetStyleWrapper, {
        inline: inline,
        mobile: mobile,
        widgetLocation: widgetLocation,
        browserWindowHeight: 0,
        size: "default",
        children: /*#__PURE__*/_jsxs(WidgetBodyDiv, {
          children: [/*#__PURE__*/_jsx("h4", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-visitor-ui.widgetErrorRetryPanel.title"
            })
          }), !inline && /*#__PURE__*/_jsx(VizExCloseButton, {
            onClick: onClose,
            "aria-label": I18n.text('conversations-visitor-ui.visitorExperienceAriaLabels.closeChatWindow')
          }), /*#__PURE__*/_jsx(FormattedJSXMessage, {
            message: "conversations-visitor-ui.widgetErrorRetryPanel.body_jsx",
            elements: {
              Link: VizExLink
            },
            options: {
              LinkProps: {
                use: 'on-bright',
                onClick: retry
              }
            }
          })]
        })
      })
    })
  });
}
WidgetErrorRetryPanel.displayName = 'WidgetErrorRetryPanel';
export default WidgetErrorRetryPanel;