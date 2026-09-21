import classNames from 'classnames';
import { isAway } from 'conversations-internal-schema/responders/operators/isAway';
import { getFriendlyOrFormalName } from 'conversations-internal-schema/responders/operators/responderGetters';
import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';
// @ts-ignore Untyped import
import mrHubBot from 'bender-url!../../../img/visitor-widget/bot-avatar.svg';
// @ts-ignore Untyped import
import aiAvatar from 'bender-url!../../../img/visitor-widget/ai-avatar.png';
import { getAvatarAltText } from './getAvatarAltText';
import { jsx as _jsx } from "react/jsx-runtime";
function getAvatarSrc(avatar, isBot, isResponderAI) {
  if (!avatar && isBot) return mrHubBot;
  if (!avatar && isResponderAI) return aiAvatar;
  return avatar !== null && avatar !== void 0 ? avatar : undefined;
}
function getIndicatorSize(size) {
  if (size === 'xxs' || size === 'xs') {
    return 'xs';
  } else if (size === 'sm' || size === 'ms') {
    return 'sm';
  } else {
    return 'md';
  }
}
function ChatHead({
  avatar = null,
  className,
  disabled = false,
  indicatorStyleOverride,
  isBot = false,
  isResponderAI = false,
  isSpotlight = false,
  onClick,
  responder,
  showStatus = false,
  size = 'md',
  style
}) {
  const renderAvatar = () => {
    const contentStyles = {
      borderRadius: '50%'
    };
    let status = undefined;
    if (showStatus && responder) {
      const agentIsAway = isAway(responder);
      status = agentIsAway ? OFFLINE : ONLINE;
    }
    const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
    const responderName = responder ? getFriendlyOrFormalName(responder) : null;
    const altText = getAvatarAltText(status, responderName || defaultAgentName);
    const avatarJSX = /*#__PURE__*/_jsx(VizExAvatar, {
      style: isSpotlight ? Object.assign({}, style, {
        padding: 0,
        background: 'none'
      }) : style,
      src: getAvatarSrc(avatar, isBot, isResponderAI),
      className: "chat-head-avatar",
      size: size,
      contentStyle: contentStyles,
      alt: altText
    });
    if (status) {
      const indicatorSize = getIndicatorSize(size);
      return /*#__PURE__*/_jsx(VizExStatusIndicator, {
        status: status,
        size: indicatorSize,
        styles: indicatorStyleOverride,
        children: avatarJSX
      });
    }
    return avatarJSX;
  };
  const classes = classNames('chat-head', className, disabled && 'chat-head-disabled');
  return /*#__PURE__*/_jsx("div", {
    className: classes,
    onClick: onClick,
    children: renderAvatar()
  });
}
ChatHead.displayName = 'ChatHead';
export default ChatHead;