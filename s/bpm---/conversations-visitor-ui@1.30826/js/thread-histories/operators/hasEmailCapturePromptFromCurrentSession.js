'use es6';

import {
    isEmailCapturePromptMessage
} from 'conversations-message-history/email-capture-prompt/operators/isEmailCapturePromptMessage';
import {
    getMessageIsApproximatelyFromCurrentSession
} from 'conversations-message-history/thread-history/operators/getMessageIsApproximatelyFromCurrentSession';
import {
    hasMessages
} from 'conversations-message-history/thread-history/operators/hasMessages';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getMessages';
export const hasEmailCapturePromptFromCurrentSession = threadHistory => {
    if (!hasMessages(threadHistory)) {
        return false;
    }
    const messages = getMessages(threadHistory);
    const lastEmailCaptureMessage = messages.findLast(isEmailCapturePromptMessage);
    return !!(lastEmailCaptureMessage && getMessageIsApproximatelyFromCurrentSession(lastEmailCaptureMessage));
};