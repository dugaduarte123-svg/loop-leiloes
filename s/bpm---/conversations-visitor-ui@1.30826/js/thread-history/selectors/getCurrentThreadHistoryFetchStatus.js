'use es6';

import {
    getStatus
} from '../../constants/asyncStatuses';
import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getCurrentThreadHistoryEntry
} from './getCurrentThreadHistoryEntry';
export const getCurrentThreadHistoryFetchStatus = createSelector(getCurrentThreadHistoryEntry, getStatus);