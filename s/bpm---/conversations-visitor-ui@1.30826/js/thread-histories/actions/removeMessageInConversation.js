'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    REMOVE_MESSAGE_IN_CONVERSATION
} from '../constants/ActionTypes';
export const removeMessageInConversation = createAction(REMOVE_MESSAGE_IN_CONVERSATION, ({
    message,
    threadId
}) => ({
    payload: {
        message,
        threadId
    }
}));