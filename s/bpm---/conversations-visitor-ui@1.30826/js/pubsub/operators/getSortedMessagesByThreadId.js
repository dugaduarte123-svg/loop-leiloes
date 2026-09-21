'use es6';

import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    getTimestamp
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    getMessage
} from 'conversations-message-history/unpublished-messages/operators/getters';
export const getSortedMessagesByThreadId = (unpublishedMessages, threadId) => {
    return unpublishedMessages.filter(message => getThreadId(message) === threadId).sort((unpublishedMessageA, unpublishedMessageB) => {
        const messageA = getMessage(unpublishedMessageA);
        const messageB = getMessage(unpublishedMessageB);
        return getTimestamp(messageA) - getTimestamp(messageB);
    });
};