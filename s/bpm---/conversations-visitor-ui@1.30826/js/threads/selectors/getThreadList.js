'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getThreads
} from './getThreads';
import {
    isPersistedThread
} from '../../threads/operators/isPersistedThread';
export const getThreadList = createSelector([getThreads], threads => {
    if (!threads) {
        return undefined;
    }
    return threads.toList().filter(thread => isPersistedThread(thread)).sortBy(thread => -thread.latestMessageTimestamp);
});