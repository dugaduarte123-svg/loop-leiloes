import { OrderedSet as ImmutableOrderedSet } from 'immutable';
const getQuickReplyOptionsFromStagedThreadMessages = messageResults => {
  let quickReplySet = ImmutableOrderedSet();
  messageResults.valueSeq().forEach(message => {
    if ('attachments' in message) {
      message.attachments.forEach(attachment => {
        if (attachment['@type'] === 'QUICK_REPLIES' && 'quickReplies' in attachment) {
          attachment.quickReplies.forEach(quickReply => {
            quickReplySet = quickReplySet.add(quickReply);
          });
        }
      });
    }
  });
  return quickReplySet;
};
export default getQuickReplyOptionsFromStagedThreadMessages;