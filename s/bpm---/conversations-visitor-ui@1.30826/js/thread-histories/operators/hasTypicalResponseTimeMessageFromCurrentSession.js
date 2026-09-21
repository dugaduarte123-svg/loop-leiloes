'use es6';

import {
    getMessageIsApproximatelyFromCurrentSession
} from 'conversations-message-history/thread-history/operators/getMessageIsApproximatelyFromCurrentSession';
import {
    isTypicalResponseTimeMessage
} from 'conversations-message-history/typical-response-time/operators/isTypicalResponseTimeMessage';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getMessages';
import {
    hasMessages
} from 'conversations-message-history/thread-history/operators/hasMessages';
export const hasTypicalResponseTimeMessageFromCurrentSession = threadHistory => {
    if (!hasMessages(threadHistory)) {
        return false;
    }
    const messages = getMessages(threadHistory);
    const lastTypicalResponseTimeMessage = messages.findLast(isTypicalResponseTimeMessage);
    return !!(lastTypicalResponseTimeMessage && getMessageIsApproximatelyFromCurrentSession(lastTypicalResponseTimeMessage));
};