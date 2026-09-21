// @ts-ignore Module does not have type definitions
import { getAnyCompanyLogo } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCompanyLogo';
// @ts-ignore Module does not have type definitions
import { getAnyCustomChatName } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCustomChatName';
import styled from 'styled-components';
import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';
import { jsx as _jsx } from "react/jsx-runtime";
const BORDER_WIDTH = 2;
const CustomUIAvatarWrapper = styled.div.withConfig({
  displayName: "CustomChatHeading__CustomUIAvatarWrapper"
})(["display:flex;height:", "px;justify-content:center;"], ({
  $size,
  $isSpotlight
}) => AVATAR_SIZES[$size] + ($isSpotlight ? 0 : BORDER_WIDTH * 2));
function CustomChatHeading({
  borderColor,
  chatHeadingConfig,
  isSpotlight = false,
  size = 'sm'
}) {
  const borderStyles = {
    padding: isSpotlight ? 0 : '2px',
    background: isSpotlight ? 'none' : borderColor,
    borderRadius: '50%'
  };
  const contentStyles = {
    borderRadius: '50%'
  };
  const src = getAnyCompanyLogo(chatHeadingConfig);
  const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
  const altText = I18n.text('conversations-visitor-experience-components.default.avatar', {
    identifier: getAnyCustomChatName(chatHeadingConfig) || defaultAgentName
  });
  if (!chatHeadingConfig) {
    return null;
  }
  return /*#__PURE__*/_jsx(CustomUIAvatarWrapper, {
    $size: size,
    $isSpotlight: isSpotlight,
    children: /*#__PURE__*/_jsx(VizExAvatar, {
      className: "chat-head-avatar",
      size: size,
      src: src,
      style: borderStyles,
      contentStyle: contentStyles,
      alt: altText
    })
  });
}
CustomChatHeading.displayName = 'CustomChatHeading';
export default CustomChatHeading;