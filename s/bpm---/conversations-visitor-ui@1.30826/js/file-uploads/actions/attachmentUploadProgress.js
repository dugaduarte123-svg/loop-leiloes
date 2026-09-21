'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    ATTACHMENT_UPLOAD_PROGRESS
} from '../constants/fileUploadsActionTypes';
export const attachmentUploadProgress = createAction(ATTACHMENT_UPLOAD_PROGRESS, ({
    localId,
    threadId,
    progress
}) => ({
    payload: {
        localId,
        threadId,
        progress
    }
}));