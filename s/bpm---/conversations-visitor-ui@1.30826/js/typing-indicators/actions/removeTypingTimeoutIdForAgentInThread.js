'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    REMOVE_TYPING_TIMEOUT_ID
} from '../constants/typingIndicatorActionTypes';
export const removeTypingTimeoutIdForAgentInThread = createAction(REMOVE_TYPING_TIMEOUT_ID, (threadId, senderId) => ({
    payload: {
        threadId,
        senderId
    }
}));