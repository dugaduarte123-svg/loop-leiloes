'use es6';

import pipe from 'transmute/pipe';
import {
    threadHistoryInvariant
} from '../invariants/threadHistoryInvariant';
import {
    getMessages
} from './getters';
export const hasMessages = threadHistory => {
    threadHistoryInvariant(threadHistory);
    return pipe(getMessages, messages => !!(messages && messages.size > 0))(threadHistory);
};