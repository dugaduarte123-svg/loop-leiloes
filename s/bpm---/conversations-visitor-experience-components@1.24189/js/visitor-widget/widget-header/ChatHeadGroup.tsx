import { WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import { getUserId, getAvatar, getIsBot, getIsResponderAI } from 'conversations-internal-schema/responders/operators/responderGetters';
import ChatHead from './ChatHead';
import { jsx as _jsx } from "react/jsx-runtime";
const BORDER_WIDTH = 2;
const chatHeadCenter = (borderColor = WHITE) => ({
  padding: `${BORDER_WIDTH}px`,
  background: `${borderColor}`,
  borderRadius: '50%',
  zIndex: 0
});
const getMarginLeft = size => {
  switch (size) {
    case 'sm':
      return -10;
    case 'xs':
      return -15;
    default:
      return -10;
  }
};
const chatHeadRight = (borderColor, zIndex, size) => Object.assign({}, chatHeadCenter(borderColor), {
  zIndex,
  marginLeft: getMarginLeft(size)
});
const ChatHeadGroupWrapper = styled.div.withConfig({
  displayName: "ChatHeadGroup__ChatHeadGroupWrapper"
})(["display:flex;height:", "px;justify-content:center;"], ({
  $size,
  $isSpotlight
}) => AVATAR_SIZES[$size] + ($isSpotlight ? 0 : BORDER_WIDTH * 2));
function getChatHeadStyle(index, borderColor, size) {
  if (index >= 1) {
    return chatHeadRight(borderColor, index, size);
  }
  return chatHeadCenter(borderColor);
}
function ChatHeadGroup({
  showStatusIndicator = false,
  indicatorStyleOverride,
  isSpotlight = false,
  responders,
  borderColor,
  size = 'sm'
}) {
  const chatHeadElements = responders.map((responder, index) => {
    const avatar = getAvatar(responder);
    const userId = getUserId(responder);
    const isBot = !!getIsBot(responder);
    const isResponderAI = !!getIsResponderAI(responder);
    const style = getChatHeadStyle(index, borderColor, size);
    const className = 'chat-head' + (index >= 1 ? " chat-group-head-right" : "");
    return /*#__PURE__*/_jsx(ChatHead, {
      avatar: avatar,
      className: className,
      isBot: isBot,
      isResponderAI: isResponderAI,
      responder: responder,
      indicatorStyleOverride: indicatorStyleOverride,
      isSpotlight: isSpotlight,
      showStatus: showStatusIndicator,
      size: size,
      style: style
    }, `chat-head.${userId}`);
  });
  return /*#__PURE__*/_jsx(ChatHeadGroupWrapper, {
    $size: size,
    $isSpotlight: isSpotlight,
    children: chatHeadElements
  });
}
ChatHeadGroup.displayName = 'ChatHeadGroup';
export default ChatHeadGroup;