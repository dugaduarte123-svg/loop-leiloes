'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getThreads
} from '../../threads/selectors/getThreads';
import {
    getSelectedThreadId
} from './getSelectedThreadId';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    getStubbedThread
} from './getStubbedThread';
export const getSelectedThread = createSelector([getThreads, getSelectedThreadId, getStubbedThread], (threads, selectedThreadId, stubbedThread) => {
    if (selectedThreadId === STUBBED_THREAD_ID) {
        return stubbedThread;
    }
    if (!threads) {
        return null;
    }
    return threads.get(selectedThreadId) || null;
});