import styled from 'styled-components';
import ChatHead from '../ChatHead';
import { getUserId, getAvatar, getFriendlyOrFormalName, getIsBot, getIsResponderAI } from 'conversations-internal-schema/responders/operators/responderGetters';
import { isAvailable } from 'conversations-internal-schema/responders/operators/isAvailable';
import { getChatHeadGroupStyle } from '../../util/getChatHeadGroupStyle';
import { jsx as _jsx } from "react/jsx-runtime";
const getMargin = (isFirst, isLast, total) => {
  const offset = total === 2 ? '-8px' : total === 3 ? '-12px' : '0';
  if (isFirst && total > 1) return `margin-right: ${offset};`;
  if (isLast && total > 1) return `margin-left: ${offset};`;
  return '';
};
const StyledChatHead = styled(ChatHead).withConfig({
  displayName: "InitialMessageChatHeadGroup__StyledChatHead"
})(["", ""], ({
  $isFirst,
  $isLast,
  $total
}) => getMargin($isFirst, $isLast, $total));
export default function InitialMessageChatHeadGroup({
  showStatusIndicator = false,
  size,
  responders,
  mobile
}) {
  const numResponders = responders.size;
  const chatHeadElements = responders.map((responder, index) => {
    const avatar = getAvatar(responder);
    const avatarName = getFriendlyOrFormalName(responder);
    const online = isAvailable(responder);
    const isBot = getIsBot(responder);
    const isResponderAI = getIsResponderAI(responder);
    const userId = getUserId(responder);
    return /*#__PURE__*/_jsx(StyledChatHead, {
      $isFirst: index === 0,
      $isLast: index === numResponders - 1,
      $total: numResponders,
      size: size,
      avatar: avatar,
      avatarName: avatarName,
      online: online,
      isBot: isBot,
      isResponderAI: !!isResponderAI,
      showStatus: showStatusIndicator,
      isVisitorWidget: true
    }, `chat-head.${userId}`);
  });
  return /*#__PURE__*/_jsx("div", {
    className: "justify-center",
    style: getChatHeadGroupStyle({
      mobile
    }),
    children: chatHeadElements
  });
}
InitialMessageChatHeadGroup.displayName = 'InitialMessageChatHeadGroup';