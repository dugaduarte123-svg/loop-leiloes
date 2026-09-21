import curry from 'transmute/curry';
import pipe from 'transmute/pipe';
// @ts-ignore untyped-file
import { messageKeyInvariant } from 'conversations-message-history/thread-history/invariants/messageKeyInvariant';
// @ts-ignore untyped-file
import { threadHistoryInvariant } from 'conversations-message-history/thread-history/invariants/threadHistoryInvariant';
// @ts-ignore untyped-file
import { setMessage } from 'conversations-message-history/thread-history/operators/setMessage';
// @ts-ignore untyped-file
import { sortMessages } from 'conversations-message-history/thread-history/operators/sortMessages';
// @ts-ignore untyped-file
import { historyMessageInvariant } from '../invariants/historyMessageInvariant';
export const addMessageToThreadHistory = curry((messageKey, message, threadHistory) => {
  messageKeyInvariant(messageKey);
  historyMessageInvariant(message);
  threadHistoryInvariant(threadHistory);
  return pipe(setMessage(messageKey, message), sortMessages)(threadHistory);
});