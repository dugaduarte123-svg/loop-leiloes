import I18n from 'I18n';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import ChatHeadingAvatars from './ChatHeadingAvatars';
import { getWidgetTitleText } from '../operators/getWidgetTitleText';
import { SMALL } from 'visitor-ui-component-library/constants/sizes';
import { HEADER_TEXT_TITLE_ID, HEADER_TEXT_DESCRIPTION_ID } from '../../visitor-widget/constants/textIds';
import { getIsResponderAI } from 'conversations-internal-schema/responders/operators/responderGetters';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const BORDER_WIDTH = 2;
const Wrapper = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__Wrapper"
})(["display:inline-flex;align-items:center;flex:1 1 auto;height:", "px;min-width:0;"], AVATAR_SIZES[SMALL] + BORDER_WIDTH * 2);
const HeaderTextWrapper = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__HeaderTextWrapper"
})(["display:flex;flex-direction:column;height:100%;width:100%;justify-content:center;min-width:0;"]);
const HeaderName = styled.h5.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__HeaderName"
})(["line-height:20px;margin-bottom:0;font-size:", ";"], props => props.titleText && props.titleText.length > 20 ? '14px' : null);
const MutedMessage = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__MutedMessage"
})(["font-size:11px;line-height:initial;"]);
const TruncateString = styled.div.withConfig({
  displayName: "WidgetHeaderAvatarWrapper__TruncateString"
})(["white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700;"]);
function WidgetHeaderAvatarWrapper({
  availabilityMessage,
  chatHeadingConfig,
  chatHeadingResponders,
  enableAIDisclaimer = false,
  locale,
  showAvailabilityMessage,
  showStatusIndicator = false,
  borderColor
}) {
  const titleText = getWidgetTitleText(chatHeadingConfig, chatHeadingResponders, locale) || I18n.text('conversations-visitor-experience-components.default.agent');
  const isResponderAI = chatHeadingResponders.some(responder => getIsResponderAI(responder) === true);
  const showAIDisclaimer = isResponderAI || enableAIDisclaimer;
  const showSubtitle = !showAIDisclaimer && showAvailabilityMessage;
  return /*#__PURE__*/_jsxs(Wrapper, {
    children: [/*#__PURE__*/_jsx("div", {
      "data-test-id": "chat-heading-avatar",
      children: /*#__PURE__*/_jsx(ChatHeadingAvatars, {
        chatHeadingConfig: chatHeadingConfig,
        chatHeadingResponders: chatHeadingResponders,
        showStatusIndicator: showStatusIndicator && !isResponderAI,
        borderColor: borderColor
      })
    }), /*#__PURE__*/_jsxs(HeaderTextWrapper, {
      className: "p-x-3",
      children: [/*#__PURE__*/_jsx(HeaderName, {
        titleText: titleText,
        "aria-level": 1,
        children: /*#__PURE__*/_jsx(TruncateString, {
          children: /*#__PURE__*/_jsx("span", {
            "data-test-id": "widget-header-name",
            className: "widget-header-name p-y-0",
            id: HEADER_TEXT_TITLE_ID,
            children: titleText
          })
        })
      }), showSubtitle && /*#__PURE__*/_jsx(MutedMessage, {
        "data-test-type": "timestamp",
        id: HEADER_TEXT_DESCRIPTION_ID,
        children: availabilityMessage
      }), showAIDisclaimer && /*#__PURE__*/_jsx(MutedMessage, {
        "data-test-id": "is-responder-ai-msg",
        children: I18n.text('conversations-visitor-experience-components.isResponderAI')
      })]
    })]
  });
}
WidgetHeaderAvatarWrapper.displayName = 'WidgetHeaderAvatarWrapper';
export default WidgetHeaderAvatarWrapper;