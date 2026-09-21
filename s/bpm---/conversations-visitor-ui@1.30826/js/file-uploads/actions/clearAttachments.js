'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    CLEAR_ATTACHMENTS
} from '../constants/fileUploadsActionTypes';
export const clearAttachments = createAction(CLEAR_ATTACHMENTS, threadId => ({
    payload: {
        threadId
    }
}));