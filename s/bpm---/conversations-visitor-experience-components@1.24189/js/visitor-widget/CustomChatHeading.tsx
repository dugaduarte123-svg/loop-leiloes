// @ts-ignore Untyped module
import { getAnyCompanyLogo } from 'conversations-internal-schema/chat-heading-config/operators/getAnyCompanyLogo';
import { getChatHeadGroupStyle } from '../util/getChatHeadGroupStyle';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';
import { jsx as _jsx } from "react/jsx-runtime";
export default function CustomChatHeading({
  chatHeadingConfig,
  mobile,
  size
}) {
  const src = getAnyCompanyLogo(chatHeadingConfig);
  const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
  const altText = I18n.text('conversations-visitor-experience-components.default.avatar', {
    identifier: chatHeadingConfig.get('customChatName') || defaultAgentName
  });
  if (!chatHeadingConfig) {
    return null;
  }
  return /*#__PURE__*/_jsx("div", {
    className: "justify-center align-center",
    style: getChatHeadGroupStyle({
      mobile
    }),
    children: /*#__PURE__*/_jsx(VizExAvatar, {
      src: src,
      className: "chat-head-avatar",
      size: size,
      alt: altText
    })
  });
}
CustomChatHeading.displayName = 'CustomChatHeading';