'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    ATTACHMENT_ERROR
} from '../constants/fileUploadsActionTypes';
export const attachmentError = createAction(ATTACHMENT_ERROR, (error, threadId) => ({
    payload: {
        error,
        threadId
    }
}));