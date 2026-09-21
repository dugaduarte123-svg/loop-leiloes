'use es6';

import {
    List as ImmutableList
} from 'immutable';
import {
    createSelector
} from '@reduxjs/toolkit';
import get from 'transmute/get';
import {
    getCurrentThreadId
} from '../../thread-history/selectors/getCurrentThreadId';
import {
    getFileUploads
} from './getFileUploads';
export const getFileUploadListForCurrentThreadId = createSelector([getFileUploads, getCurrentThreadId], (fileUploadMap, threadId) => {
    const fileUploads = get(threadId, fileUploadMap);
    if (!fileUploads) {
        return ImmutableList();
    }
    return fileUploads.toList();
});