import get from 'transmute/get';
import keySeq from 'transmute/keySeq';
import { Map as ImmutableMap } from 'immutable';
import DirectReply from '../records/DirectReply';
export const buildDirectReplies = directReplies => {
  const directReplyMessages = get('directReplyMessages', directReplies);
  if (!directReplyMessages) {
    return ImmutableMap({
      directReplyMessages: ImmutableMap()
    });
  }
  const directReplyIds = keySeq(directReplyMessages);
  const builtDirectReplyMessages = directReplyIds.reduce((directRepliesMap, id) => {
    const directReply = get(id, directReplyMessages);
    return directRepliesMap.set(id, DirectReply(directReply));
  }, ImmutableMap());
  return ImmutableMap({
    directReplyMessages: builtDirectReplyMessages
  });
};