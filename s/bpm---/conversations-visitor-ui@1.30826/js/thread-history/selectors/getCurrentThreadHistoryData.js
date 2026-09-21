'use es6';

import {
    getData
} from '../../constants/asyncStatuses';
import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getCurrentThreadHistoryEntry
} from './getCurrentThreadHistoryEntry';
import {
    getCurrentThreadId
} from './getCurrentThreadId';
import {
    getStagedThreadHistory
} from '../../thread-create/selectors/stagedThreadSelectors';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
export const getCurrentThreadHistoryData = createSelector([getCurrentThreadId, getCurrentThreadHistoryEntry, getStagedThreadHistory], (threadId, threadEntry, stagedThreadHistory) => {
    if (threadId === STUBBED_THREAD_ID) {
        return stagedThreadHistory;
    }
    return getData(threadEntry) || null;
});