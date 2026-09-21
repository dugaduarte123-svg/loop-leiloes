'use es6';

import both from 'transmute/both';
import {
    isInitialMessage
} from 'conversations-message-history/initial-message/operators/isInitialMessage';
import {
    isFromAgent
} from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import {
    getMessageIsApproximatelyFromCurrentSession
} from 'conversations-message-history/thread-history/operators/getMessageIsApproximatelyFromCurrentSession';
import {
    hasMessages
} from 'conversations-message-history/thread-history/operators/hasMessages';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getMessages';
export const hasAgentReplyFromCurrentSession = threadHistory => {
    if (!threadHistory || !hasMessages(threadHistory)) {
        return false;
    }
    const messages = getMessages(threadHistory);
    const mostRecentAgentReply = messages.findLast(both(message => !isInitialMessage(message), isFromAgent));
    return !!(mostRecentAgentReply && getMessageIsApproximatelyFromCurrentSession(mostRecentAgentReply));
};