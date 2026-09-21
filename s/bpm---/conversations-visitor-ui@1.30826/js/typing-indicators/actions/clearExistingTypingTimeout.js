'use es6';

import {
    getSenderId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    typingStates as typingStatesSelector
} from '../selectors/typingStates';
import {
    getTypingTimeoutIdForAgentInThread
} from '../operators/getTypingTimeoutIdForAgentInThread';
export const clearExistingTypingTimeout = (message, threadId) => (dispatch, getState) => {
    const senderId = getSenderId(message);
    const typingStates = typingStatesSelector(getState());
    const existingTimeoutId = getTypingTimeoutIdForAgentInThread({
        threadId: `${threadId}`,
        senderId: `${senderId}`,
        typingStates
    });
    if (typeof existingTimeoutId === 'number') {
        clearTimeout(existingTimeoutId);
    }
};