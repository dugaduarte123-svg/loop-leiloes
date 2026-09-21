'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getThreadId
} from '../operators/threadGetters';
import {
    getThreadList
} from './getThreadList';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
export const calculateUnseenThreadsCountExcludeCurrent = createSelector([getThreadList, getSelectedThreadId], (threads, selectedThreadId) => {
    if (!threads) {
        return 0;
    }
    return threads.reduce((unseenCount, thread) => {
        if (getThreadId(thread) !== selectedThreadId) {
            return unseenCount + (thread.unseenCount ? 1 : 0);
        }
        return unseenCount;
    }, 0);
});