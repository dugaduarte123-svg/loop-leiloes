'use es6';

import {
    getSenderId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    isFromVisitor
} from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import {
    getTypingMessageTimeoutSeconds
} from 'conversations-message-history/typing-indicator/operators/getTypingMessageTimeoutSeconds';
import {
    getTypingMessageLabel,
    getTypingMessageStyle
} from 'conversations-message-history/typing-indicator/operators/getTypingMessageStyle';
import {
    getTypingMessageShouldDisableUserInput
} from 'conversations-message-history/typing-indicator/operators/getTypingMessageShouldDisableUserInput';
import {
    TYPING_MESSAGE_STYLE
} from 'conversations-message-history/typing-indicator/records/TypingIndicatorMessage';
import {
    TYPING_INDICATOR_TIMEOUT_MS
} from '../constants/typingStateConstants';
import {
    addTypingTimeoutIdForAgentInThread
} from './addTypingTimeoutIdForAgentInThread';
import {
    dismissTypingIndicator
} from './dismissTypingIndicator';
import {
    clearExistingTypingTimeout
} from './clearExistingTypingTimeout';
import {
    setTypingIndicatorStyle,
    clearTypingIndicatorStyle
} from '../typingIndicatorStyle';
export const typingMessageReceived = (message, threadId, timeoutMs = TYPING_INDICATOR_TIMEOUT_MS) => dispatch => {
    if (isFromVisitor(message)) {
        return;
    }
    const style = getTypingMessageStyle(message) || TYPING_MESSAGE_STYLE.TYPING;
    const shouldDisableUserInput = getTypingMessageShouldDisableUserInput(message);
    const label = getTypingMessageLabel(message) || null;

    // If the Typing Message contains it's own timeout, use that, otherwise use what's passed in to the function.
    const typingMessageTimeoutSeconds = getTypingMessageTimeoutSeconds(message);
    const typingMessageTimeoutMs = typingMessageTimeoutSeconds * 1000 || timeoutMs;
    const senderId = getSenderId(message);
    dispatch(clearExistingTypingTimeout(message, threadId));
    const timeoutId = setTimeout(() => {
        dispatch(dismissTypingIndicator(message, threadId));
        dispatch(clearTypingIndicatorStyle({
            threadId,
            senderId
        }));
    }, typingMessageTimeoutMs);
    dispatch(setTypingIndicatorStyle({
        threadId,
        senderId,
        style,
        shouldDisableUserInput,
        label
    }));
    dispatch(addTypingTimeoutIdForAgentInThread(threadId, senderId, timeoutId));
};