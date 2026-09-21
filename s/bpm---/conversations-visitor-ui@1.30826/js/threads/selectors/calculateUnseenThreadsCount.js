'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getUnseenCount
} from '../operators/threadGetters';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    calculateUnseenThreadsCountExcludeCurrent
} from './calculateUnseenThreadsCountExcludeCurrent';
export const calculateUnseenThreadsCount = createSelector([getSelectedThread, calculateUnseenThreadsCountExcludeCurrent], (selectedThread, unseenCount) => {
    if (!selectedThread) {
        return unseenCount;
    }
    return unseenCount + (getUnseenCount(selectedThread) ? 1 : 0);
});