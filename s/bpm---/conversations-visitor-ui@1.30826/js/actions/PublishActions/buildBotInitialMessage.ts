import { BOT_SENDER } from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import { SENT } from 'conversations-message-history/common-message-format/constants/statusTypes';
import { buildSender } from 'conversations-message-history/common-message-format/operators/buildSender';
// @ts-ignore not typed
import { buildInitialMessage } from 'conversations-message-history/initial-message/operators/buildInitialMessage';
import { generateUniqueClientTimestamp } from 'conversations-message-history/util/timestamps';
// @ts-ignore not typed
import { buildHubSpotSystemSender } from 'conversations-message-history/common-message-format/operators/buildHubSpotSystemSender';
import { buildContactRecipients } from 'conversations-message-history/common-message-format/operators/buildCommonMessageRecipients';
import { CHANNEL_SPECIFIC_OPAQUE_ID } from 'conversations-message-history/common-message-format/constants/deliveryIdentifierTypes';
import { LIVE_CHAT_GENERIC_CHANNEL_ID } from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import { getMessagesUtk } from '../../query-params/getMessagesUtk';
export function buildBotInitialMessage({
  text,
  richText,
  attachments = [],
  channelInstanceId,
  sender,
  status,
  id,
  clientType
}) {
  var _getMessagesUtk;
  const timestamp = generateUniqueClientTimestamp();
  return buildInitialMessage({
    id,
    clientType,
    sender: sender !== null && sender !== void 0 ? sender : buildSender({
      senderType: BOT_SENDER
    }),
    status: status !== null && status !== void 0 ? status : {
      messageStatus: SENT,
      timestamp
    },
    genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
    attachments,
    text,
    richText,
    timestamp,
    channelInstanceId,
    senders: buildHubSpotSystemSender(),
    recipients: buildContactRecipients({
      type: CHANNEL_SPECIFIC_OPAQUE_ID,
      value: (_getMessagesUtk = getMessagesUtk()) !== null && _getMessagesUtk !== void 0 ? _getMessagesUtk : ''
    })
  });
}