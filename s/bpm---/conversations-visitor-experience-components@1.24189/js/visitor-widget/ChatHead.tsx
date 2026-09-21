import { Component } from 'react';
import classNames from 'classnames';

// @ts-ignore Untyped import
import mrHubBot from 'bender-url!../../img/visitor-widget/bot-avatar.svg';
// @ts-ignore Untyped import
import aiAvatar from 'bender-url!../../img/visitor-widget/ai-avatar.png';
import VizExStatusIndicator from 'visitor-ui-component-library/indicator/VizExStatusIndicator';
import { OFFLINE, ONLINE } from 'visitor-ui-component-library/indicator/constants/StatusIndicatorStatus';
import VizExAvatar from 'visitor-ui-component-library/avatar/VizExAvatar';
import I18n from 'I18n';
import { jsx as _jsx } from "react/jsx-runtime";
function getAvatarSrc(avatar, isBot, isResponderAI) {
  if (!avatar && isBot) return mrHubBot;
  if (!avatar && isResponderAI) return aiAvatar;
  return avatar !== null && avatar !== void 0 ? avatar : undefined;
}
export default class ChatHead extends Component {
  constructor(...args) {
    super(...args);
    this.renderAvatar = () => {
      const {
        isBot,
        isResponderAI,
        avatar,
        avatarAlt,
        avatarName,
        style,
        size,
        online,
        showStatus
      } = this.props;
      const defaultAgentName = I18n.text('conversations-visitor-experience-components.default.agent');
      const i18nOptions = {
        identifier: avatarName || defaultAgentName
      };
      const avatarProps = {
        style,
        src: getAvatarSrc(avatar, isBot, isResponderAI),
        className: 'chat-head-avatar',
        size,
        alt: avatarAlt === undefined ? I18n.text('conversations-visitor-experience-components.default.avatar', i18nOptions) : avatarAlt
      };
      if (showStatus) {
        const status = online ? ONLINE : OFFLINE;
        avatarProps.alt = status === ONLINE ? I18n.text('conversations-visitor-experience-components.default.avatarAvailable', i18nOptions) : I18n.text('conversations-visitor-experience-components.default.avatarAway', i18nOptions);
        const indicatorSize = size === 'ms' ? 'sm' : size;
        return /*#__PURE__*/_jsx(VizExStatusIndicator, {
          status: status,
          size: indicatorSize,
          children: /*#__PURE__*/_jsx(VizExAvatar, Object.assign({}, avatarProps))
        });
      }
      return /*#__PURE__*/_jsx(VizExAvatar, Object.assign({}, avatarProps));
    };
  }
  render() {
    const {
      onClick,
      className,
      disabled
    } = this.props;
    const classes = classNames('chat-head', className, disabled && 'chat-head-disabled');
    return /*#__PURE__*/_jsx("div", {
      className: classes,
      onClick: onClick,
      children: this.renderAvatar()
    });
  }
}
ChatHead.displayName = 'ChatHead';
ChatHead.defaultProps = {
  avatar: null,
  avatarName: '',
  away: false,
  disabled: false,
  online: false,
  showStatus: false,
  isVisitorWidget: false,
  size: 'md'
};