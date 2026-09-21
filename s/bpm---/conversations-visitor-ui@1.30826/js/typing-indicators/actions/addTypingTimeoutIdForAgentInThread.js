'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    ADD_TYPING_TIMEOUT_ID
} from '../constants/typingIndicatorActionTypes';
import {
    TYPING_MESSAGE_STYLE
} from 'conversations-message-history/typing-indicator/records/TypingIndicatorMessage';
export const addTypingTimeoutIdForAgentInThread = createAction(ADD_TYPING_TIMEOUT_ID, (threadId, senderId, timeoutId, typingMessageStyle = TYPING_MESSAGE_STYLE.TYPING, shouldDisableUserInput = false) => ({
    payload: {
        threadId,
        senderId,
        timeoutId,
        typingMessageStyle,
        shouldDisableUserInput
    }
}));