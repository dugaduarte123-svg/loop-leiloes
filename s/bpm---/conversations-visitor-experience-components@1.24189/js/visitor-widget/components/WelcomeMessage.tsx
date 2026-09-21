import I18n from 'I18n';
import styled from 'styled-components';
import { formatHtml } from 'sanitize-text/sanitizers/HtmlSanitizer';
import { WHITE, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import WelcomeMessageAvatars from '../WelcomeMessageAvatars';
import WelcomeMessageQuickReplies from './WelcomeMessageQuickReplies';
import ConsentPromptV2 from './ConsentPromptV2';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const BubbleWrapper = styled.div.withConfig({
  displayName: "WelcomeMessage__BubbleWrapper"
})(["position:relative;margin-top:40px;"]);
const Bubble = styled.div.withConfig({
  displayName: "WelcomeMessage__Bubble"
})(["display:flex;flex-direction:", ";align-items:center;justify-content:center;box-sizing:border-box;position:relative;background:", ";border-radius:8px;font-size:14px;line-height:24px;color:", ";padding:24px 16px 16px 16px;box-shadow:1px 1px 10px 0px rgba(0,0,0,0.28);min-width:150px;max-width:250px;min-height:80px;"], ({
  hasFooter
}) => hasFooter ? 'column' : 'row', WHITE, NEUTRAL_1600);
const Text = styled.div.withConfig({
  displayName: "WelcomeMessage__Text"
})(["width:max-content;word-break:break-word;max-width:100%;cursor:default;margin:0;display:flex;flex-direction:column;gap:10px;& p{margin-block:0;}"]);
const CloseButton = styled(VizExIconButton).withConfig({
  displayName: "WelcomeMessage__CloseButton"
})(["position:absolute;top:0;right:0;color:", ";"], NEUTRAL_1600);
export const WelcomeMessage = ({
  onClick,
  initialMessage,
  isMobile = false,
  chatHeadingConfig,
  chatHeadingResponders,
  onClose,
  showQuickReplies = false,
  quickRepliesConfig,
  consentConfig
}) => {
  const hasFooter = showQuickReplies || !!consentConfig;
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };
  return /*#__PURE__*/_jsxs(BubbleWrapper, {
    children: [/*#__PURE__*/_jsxs(Bubble, {
      role: "button",
      tabIndex: 0,
      onClick: onClick,
      onKeyDown: handleKeyDown,
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.open'),
      "data-test-id": "welcome-message-button",
      "aria-haspopup": "dialog",
      hasFooter: hasFooter,
      children: [/*#__PURE__*/_jsx(WelcomeMessageAvatars, {
        chatHeadingConfig: chatHeadingConfig,
        chatHeadingResponders: chatHeadingResponders,
        mobile: isMobile
      }), /*#__PURE__*/_jsx(Text, {
        id: "welcome-message",
        "data-test-id": "initial-message-text",
        dangerouslySetInnerHTML: {
          __html: formatHtml(initialMessage || '')
        }
      }), showQuickReplies && quickRepliesConfig && /*#__PURE__*/_jsx(WelcomeMessageQuickReplies, {
        quickReplyOptions: quickRepliesConfig.quickReplyOptions,
        onQuickReplyClick: quickRepliesConfig.onQuickReplyClick,
        accentColor: quickRepliesConfig.accentColor
      }), consentConfig && /*#__PURE__*/_jsx(ConsentPromptV2, {
        consentMessage: consentConfig.consentMessage,
        showConsentButton: consentConfig.showConsentButton,
        onConsentAccept: consentConfig.onConsentAccept,
        showSpamProtection: consentConfig.showSpamProtection,
        accentColor: consentConfig.accentColor,
        showDivider: true,
        isAIChatBot: consentConfig.isAIChatBot
      })]
    }), /*#__PURE__*/_jsx(CloseButton, {
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.closeWelcomePage'),
      onClick: onClose,
      use: "primary-transparent-background",
      size: "sm",
      "data-test-id": "welcome-message-close-button",
      children: /*#__PURE__*/_jsx(VizExIcon, {
        size: "xs",
        icon: /*#__PURE__*/_jsx(SVGClose, {})
      })
    })]
  });
};
WelcomeMessage.displayName = 'WelcomeMessage';
export default WelcomeMessage;