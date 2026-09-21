import InitialMessageChatHeadGroup from './InitialMessageChatHeadGroup';
import CustomChatHeading from '../CustomChatHeading';
import { jsx as _jsx } from "react/jsx-runtime";
export default function InitialMessageAvatars({
  chatHeadingConfig,
  chatHeadingResponders,
  mobile = false,
  showStatusIndicator = false
}) {
  const size = mobile ? 'sm' : 'ms';
  const AvatarComponent = chatHeadingResponders.size ? InitialMessageChatHeadGroup : CustomChatHeading;
  return /*#__PURE__*/_jsx(AvatarComponent, {
    size: size,
    mobile: mobile,
    responders: chatHeadingResponders,
    chatHeadingConfig: chatHeadingConfig,
    showStatusIndicator: showStatusIndicator
  });
}
InitialMessageAvatars.displayName = 'InitialMessageAvatars';