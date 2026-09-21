'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    REMOVE_ATTACHMENT
} from '../constants/fileUploadsActionTypes';
export const removeAttachment = createAction(REMOVE_ATTACHMENT, ({
    localId,
    threadId
}) => ({
    payload: {
        localId,
        threadId
    }
}));