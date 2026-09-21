'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import {
    uninitialized
} from '../../constants/asyncStatuses';
import {
    getThreadHistories
} from '../../thread-histories/selectors/getThreadHistories';
import {
    getCurrentThreadId
} from './getCurrentThreadId';
const DEFAULT_ENTRY = uninitialized(new ThreadHistory());
export const getCurrentThreadHistoryEntry = createSelector([getThreadHistories, getCurrentThreadId], (histories, threadId) => {
    if (typeof threadId !== 'number') {
        return null;
    }
    return (histories === null || histories === void 0 ? void 0 : histories.get(threadId)) || DEFAULT_ENTRY;
});