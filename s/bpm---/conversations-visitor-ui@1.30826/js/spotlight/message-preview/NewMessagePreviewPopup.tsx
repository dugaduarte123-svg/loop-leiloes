import { useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import { formatHtml } from 'sanitize-text/sanitizers/HtmlSanitizer';
import { getTextContentFromHtml } from 'sanitize-text/sanitizers/TextSanitizer';
import styled, { keyframes } from 'styled-components';
import SVGAttach from 'visitor-ui-component-library-icons/icons/SVGAttach';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import { hexToRgba } from 'visitor-ui-component-library/utils/hexToRgba';
import ChatHead from 'conversations-visitor-experience-components/visitor-widget/ChatHead';
import Card from 'conversations-visitor-experience-components/presentation-components/spotlight/Card';
import UnreadCountBadge from 'conversations-visitor-experience-components/visitor-widget/spotlight/UnreadCountBadge';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const slideInUp = keyframes(["from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}"]);
const slideOutDown = keyframes(["from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(8px);}"]);
const ClickTarget = styled.div.withConfig({
  displayName: "NewMessagePreviewPopup__ClickTarget"
})(["cursor:pointer;margin-bottom:", ";width:", "px;animation:", " 250ms ease-out forwards;@media (prefers-reduced-motion:reduce){animation-duration:1ms;}&:hover > *{border-color:", ";}"], ({
  theme
}) => theme.spotlight.spacing.sm, ({
  $width
}) => $width, ({
  $isDismissing
}) => $isDismissing ? slideOutDown : slideInUp, ({
  theme
}) => theme.spotlight.color.border);
const PreviewCard = styled(Card).withConfig({
  displayName: "NewMessagePreviewPopup__PreviewCard"
})(["border-radius:", ";padding:", ";border:1px solid transparent;"], ({
  theme
}) => theme.spotlight.borderRadius.lg, ({
  theme
}) => `${theme.spotlight.spacing.md} ${theme.spotlight.spacing.md} ${theme.spotlight.spacing.md} ${theme.spotlight.spacing.lg}`);
const Header = styled.div.withConfig({
  displayName: "NewMessagePreviewPopup__Header"
})(["display:flex;align-items:flex-start;gap:", ";"], ({
  theme
}) => theme.spotlight.spacing.sm);
const AvatarWrapper = styled.div.withConfig({
  displayName: "NewMessagePreviewPopup__AvatarWrapper"
})(["flex-shrink:0;"]);
const Content = styled.div.withConfig({
  displayName: "NewMessagePreviewPopup__Content"
})(["flex:1;min-width:0;"]);
const AgentName = styled.p.withConfig({
  displayName: "NewMessagePreviewPopup__AgentName"
})(["margin:0 0 ", " 0;font-size:", ";font-weight:", ";color:", ";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"], ({
  theme
}) => theme.spotlight.spacing.xs, ({
  theme
}) => theme.spotlight.typography.fontSize.md, ({
  theme
}) => theme.spotlight.typography.fontWeight.regular, ({
  theme
}) => theme.spotlight.color.muted);
const PreviewText = styled.div.withConfig({
  displayName: "NewMessagePreviewPopup__PreviewText"
})(["margin:0;font-size:", ";line-height:", ";color:", ";display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"], ({
  theme
}) => theme.spotlight.typography.fontSize.xl, ({
  theme
}) => theme.spotlight.typography.lineHeight.lg, ({
  theme
}) => theme.spotlight.color.ink);
const SpotlightChatHead = styled(ChatHead).withConfig({
  displayName: "NewMessagePreviewPopup__SpotlightChatHead"
})(["", "::after{bottom:0;}"], VizExStatusIndicator);
const CloseButton = styled(VizExIconButton).withConfig({
  displayName: "NewMessagePreviewPopup__CloseButton"
})(["color:", ";&:hover{background-color:", ";}"], ({
  theme
}) => theme.spotlight.color.ink, ({
  theme
}) => hexToRgba(theme.spotlight.color.ink, 0.1));
const NewMessagePreviewPopup = ({
  agentName,
  agentJobTitle,
  agentAvatarUrl,
  isBot,
  isResponderAI,
  isOnline,
  isDismissing,
  hasAttachment,
  messagePreviewText,
  unreadCount,
  width,
  onDismiss,
  onDismissAnimationEnd,
  onOpen
}) => {
  // No useOnEscapeKey here — the popup never receives focus when it appears so
  // the ref-scoped listener would never fire. Escape-to-dismiss is dead code for
  // a passive notification that doesn't steal focus.
  const handleKeyDown = useCallback(e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
      e.preventDefault();
      onOpen();
    }
  }, [onOpen]);
  const handleDismissClick = useCallback(e => {
    e.stopPropagation();
    onDismiss();
  }, [onDismiss]);
  return /*#__PURE__*/_jsx(ClickTarget, {
    $width: width,
    $isDismissing: isDismissing,
    onAnimationEnd: isDismissing ? onDismissAnimationEnd : undefined,
    tabIndex: 0,
    onClick: onOpen,
    onKeyDown: handleKeyDown,
    role: "alertdialog",
    "aria-label": I18n.text('conversations-visitor-ui.spotlight.newMessagePreviewPopup.dialogLabel', {
      agentName
    }),
    "data-test-id": "spotlight-new-message-preview-popup",
    children: /*#__PURE__*/_jsxs(PreviewCard, {
      children: [/*#__PURE__*/_jsx(UnreadCountBadge, {
        count: unreadCount
      }), /*#__PURE__*/_jsxs(Header, {
        children: [/*#__PURE__*/_jsx(AvatarWrapper, {
          children: /*#__PURE__*/_jsx(SpotlightChatHead, {
            avatar: agentAvatarUrl,
            avatarName: agentName,
            isBot: isBot,
            isResponderAI: isResponderAI,
            online: isOnline,
            showStatus: true,
            size: "sm"
          })
        }), /*#__PURE__*/_jsxs(Content, {
          children: [/*#__PURE__*/_jsx(AgentName, {
            children: agentJobTitle !== null && agentJobTitle !== void 0 ? agentJobTitle : agentName
          }), hasAttachment ? /*#__PURE__*/_jsxs(PreviewText, {
            children: [/*#__PURE__*/_jsx(VizExIcon, {
              className: "m-right-2",
              icon: /*#__PURE__*/_jsx(SVGAttach, {})
            }), getTextContentFromHtml(messagePreviewText) || /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-visitor-ui.attachments.threadPreview"
            })]
          }) : /*#__PURE__*/_jsx(PreviewText, {
            dangerouslySetInnerHTML: {
              __html: formatHtml(messagePreviewText)
            }
          })]
        }), /*#__PURE__*/_jsx(CloseButton, {
          "aria-label": I18n.text('conversations-visitor-ui.spotlight.newMessagePreviewPopup.dismiss'),
          onClick: handleDismissClick,
          use: "primary-transparent-background",
          size: "sm",
          "data-test-id": "spotlight-new-message-preview-popup-close",
          children: /*#__PURE__*/_jsx(VizExIcon, {
            size: "xs",
            icon: /*#__PURE__*/_jsx(SVGClose, {})
          })
        })]
      })]
    })
  });
};
NewMessagePreviewPopup.displayName = 'NewMessagePreviewPopup';
export default NewMessagePreviewPopup;