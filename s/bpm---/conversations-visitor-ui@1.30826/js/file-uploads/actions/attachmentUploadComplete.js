'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    ATTACHMENT_UPLOAD_COMPLETE
} from '../constants/fileUploadsActionTypes';
export const attachmentUploadComplete = createAction(ATTACHMENT_UPLOAD_COMPLETE, ({
    localId,
    threadId,
    fileId,
    uploadedFile
}) => ({
    payload: {
        localId,
        threadId,
        fileId,
        uploadedFile
    }
}));