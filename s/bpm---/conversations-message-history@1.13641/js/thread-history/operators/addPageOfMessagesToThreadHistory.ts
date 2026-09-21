import curry from 'transmute/curry';
import pipe from 'transmute/pipe';

// @ts-ignore ts-migrate
import { threadHistoryInvariant } from '../invariants/threadHistoryInvariant';
// @ts-ignore ts-migrate
import { mergeMessages } from './mergeMessages';
// @ts-ignore ts-migrate
import { sortMessages } from './sortMessages';
import { getMessages, getAttachments, getDirectReplies, getFriendlyNameResults } from './getters';
// @ts-ignore ts-migrate
import { mergeAttachments } from './mergeAttachments';
import { mergeDirectReplies } from './mergeDirectReplies';
import { mergeFriendlyNames } from './mergeFriendlyNames';

/**
 * Add a new page of messages to a Threadhistory
 *
 * @param {ThreadHistory} newThreadHistory
 * @param {ThreadHistory} threadHistory
 * @returns {ThreadHistory}
 */
export const addPageOfMessagesToThreadHistory = curry((newThreadHistory, threadHistory) => {
  threadHistoryInvariant(newThreadHistory);
  threadHistoryInvariant(threadHistory);
  return pipe(mergeMessages(getMessages(threadHistory)), sortMessages, mergeAttachments(getAttachments(threadHistory)), mergeDirectReplies(getDirectReplies(threadHistory)), mergeFriendlyNames(getFriendlyNameResults(threadHistory)))(newThreadHistory);
});