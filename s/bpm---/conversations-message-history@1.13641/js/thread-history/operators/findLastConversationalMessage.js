'use es6';

import filter from 'transmute/filter';
import pipe from 'transmute/pipe';
import {
    isConversationalMessage
} from '../../common-message/operators/isConversationalMessage';
import {
    threadHistoryInvariant
} from '../invariants/threadHistoryInvariant';
import {
    getMessages
} from './getters';

/**
 * find the last conversational message in a ThreadHistory
 *
 * @param {ThreadHistory} threadHistory
 * @returns {MessageRecord}
 */
export const findLastConversationalMessage = threadHistory => {
    threadHistoryInvariant(threadHistory);
    return pipe(getMessages, filter(isConversationalMessage), messages => messages && messages.last())(threadHistory);
};