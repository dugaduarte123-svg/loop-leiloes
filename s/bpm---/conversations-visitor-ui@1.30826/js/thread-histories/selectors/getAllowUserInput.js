'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    historyDataForThread
} from './historyDataForThread';
import {
    isCommonMessageFormat,
    isEmailCMF
} from 'conversations-message-history/common-message-format/operators/cmfComparators';
import {
    isInitialMessage
} from 'conversations-message-history/initial-message/operators/isInitialMessage';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getMessages';
import {
    getQuickReplyAllowUserInput
} from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import {
    hasMessages
} from 'conversations-message-history/thread-history/operators/hasMessages';
export const getAllowUserInput = createSelector([historyDataForThread], history => {
    if (!history || !hasMessages(history)) {
        return true;
    }
    const chatOrInitialMessages = getMessages(history).filter(message => {
        return isCommonMessageFormat(message) && !isEmailCMF(message) || isInitialMessage(message);
    });
    const mostRecentMessage = chatOrInitialMessages.last();
    return getQuickReplyAllowUserInput(mostRecentMessage);
});