'use es6';

import pipe from 'transmute/pipe';
import {
    threadHistoryInvariant
} from '../invariants/threadHistoryInvariant';
import {
    getMessages
} from './getters';

/**
 * Convert a ThreadHistory to List<MessageRecords>
 *
 * @param {ThreadHistory} threadHistory
 * @returns {List}
 */
export const threadHistoryToMessageList = threadHistory => {
    threadHistoryInvariant(threadHistory);
    return pipe(getMessages, messages => messages && messages.toList())(threadHistory);
};