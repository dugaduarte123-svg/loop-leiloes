'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import {
    uninitialized
} from '../../constants/asyncStatuses';
import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    getThreadHistories
} from './getThreadHistories';
import {
    threadFromProps
} from '../../threads/selectors/threadFromProps';
const DEFAULT_ENTRY = uninitialized(new ThreadHistory());
export const historyForThread = createSelector([getThreadHistories, threadFromProps], (histories, thread) => {
    const threadId = getThreadId(thread);
    if (typeof threadId !== 'number') {
        return null;
    }
    return (histories === null || histories === void 0 ? void 0 : histories.get(threadId)) || DEFAULT_ENTRY;
});