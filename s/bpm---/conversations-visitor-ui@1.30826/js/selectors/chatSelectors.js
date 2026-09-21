'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getQuickReply
} from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import {
    isCommonMessageFormat,
    isEmailCMF
} from 'conversations-message-history/common-message-format/operators/cmfComparators';
import {
    isInitialMessage
} from 'conversations-message-history/initial-message/operators/isInitialMessage';
import {
    historyDataForThread
} from '../thread-histories/selectors/historyDataForThread';
import {
    hasMessages
} from 'conversations-message-history/thread-history/operators/hasMessages';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getMessages';
export const hasUnansweredQuickReplyMessage = createSelector(historyDataForThread, history => {
    if (!history || !hasMessages(history)) {
        return false;
    }
    const chatOrInitialMessages = getMessages(history).filter(message => {
        return isCommonMessageFormat(message) && !isEmailCMF(message) || isInitialMessage(message);
    });
    const mostRecentMessage = chatOrInitialMessages.last();
    return Boolean(getQuickReply(mostRecentMessage));
});