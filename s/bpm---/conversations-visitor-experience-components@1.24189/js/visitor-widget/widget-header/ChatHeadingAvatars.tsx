import ChatHeadGroup from './ChatHeadGroup';
import CustomChatHeading from './CustomChatHeading';
import { jsx as _jsx } from "react/jsx-runtime";
function ChatHeadingAvatars({
  chatHeadingConfig,
  chatHeadingResponders,
  indicatorStyleOverride,
  isSpotlight = false,
  showStatusIndicator = false,
  borderColor,
  size = 'sm'
}) {
  if (chatHeadingResponders.size) {
    return /*#__PURE__*/_jsx(ChatHeadGroup, {
      indicatorStyleOverride: indicatorStyleOverride,
      isSpotlight: isSpotlight,
      responders: chatHeadingResponders,
      showStatusIndicator: showStatusIndicator,
      borderColor: borderColor,
      size: size
    });
  }
  return /*#__PURE__*/_jsx(CustomChatHeading, {
    chatHeadingConfig: chatHeadingConfig,
    isSpotlight: isSpotlight,
    borderColor: borderColor,
    size: size
  });
}
ChatHeadingAvatars.displayName = 'ChatHeadingAvatars';
export default ChatHeadingAvatars;