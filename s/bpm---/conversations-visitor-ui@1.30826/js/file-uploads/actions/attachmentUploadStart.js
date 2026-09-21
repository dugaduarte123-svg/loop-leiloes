'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    ATTACHMENT_UPLOAD_START
} from '../constants/fileUploadsActionTypes';
export const attachmentUploadStart = createAction(ATTACHMENT_UPLOAD_START, ({
    attachment,
    threadId
}) => ({
    payload: {
        attachment,
        threadId
    }
}));