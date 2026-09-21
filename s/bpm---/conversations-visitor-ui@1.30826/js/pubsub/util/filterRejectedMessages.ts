// @ts-ignore untyped module
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
// @ts-ignore untyped module
import { isCommonMessageFormat } from 'conversations-message-history/common-message-format/operators/cmfComparators';
import { getRejectedMessageId } from 'conversations-message-history/message-rejected/operators/messageRejectedGetters';
import { isRejectedMessage } from 'conversations-message-history/message-rejected/operators/isRejectedMessage';
import { deserialize } from 'conversations-message-history/common-message/serializers/messageSerializer';
export const shouldExcludeMessage = (message, rejectedMessageIds) => {
  if (isRejectedMessage(message)) {
    return true;
  }
  if (isCommonMessageFormat(message) && rejectedMessageIds.has(getId(message))) {
    return true;
  }
  return false;
};
const getRejectedMessageIdsFromPubSubMessages = messages => {
  const rejectedMessageIds = new Set();
  messages.forEach(pubSubMessage => {
    const messageJson = pubSubMessage === null || pubSubMessage === void 0 ? void 0 : pubSubMessage.data;
    if (!messageJson) return;
    try {
      const message = deserialize({
        json: messageJson
      });
      if (isRejectedMessage(message)) {
        const rejectedId = getRejectedMessageId(message);
        if (rejectedId) {
          rejectedMessageIds.add(rejectedId);
        }
      }
    } catch (_unused) {
      return;
    }
  });
  return rejectedMessageIds;
};
export const filterRejectedMessagesFromPlayback = messages => {
  const rejectedMessageIds = getRejectedMessageIdsFromPubSubMessages(messages);
  return messages.filter(pubSubMessage => {
    const messageJson = pubSubMessage === null || pubSubMessage === void 0 ? void 0 : pubSubMessage.data;
    if (!messageJson) return true;
    try {
      const message = deserialize({
        json: messageJson
      });
      return !shouldExcludeMessage(message, rejectedMessageIds);
    } catch (_unused2) {
      return true;
    }
  });
};