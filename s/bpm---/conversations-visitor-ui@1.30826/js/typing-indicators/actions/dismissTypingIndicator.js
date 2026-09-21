'use es6';

import {
    getSenderId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    clearExistingTypingTimeout
} from './clearExistingTypingTimeout';
import {
    removeTypingTimeoutIdForAgentInThread
} from './removeTypingTimeoutIdForAgentInThread';
import {
    clearTypingIndicatorStyle
} from '../typingIndicatorStyle';
export const dismissTypingIndicator = (message, threadId) => dispatch => {
    const senderId = getSenderId(message);
    dispatch(clearExistingTypingTimeout(message, threadId));
    dispatch(removeTypingTimeoutIdForAgentInThread(threadId, senderId));
    dispatch(clearTypingIndicatorStyle({
        threadId,
        senderId
    }));
};