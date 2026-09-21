'use es6';

import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getters';
import {
    wrapFailedMessage
} from 'conversations-message-history/common-message-format/operators/wrapFailedMessage';
import {
    getChannelName,
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    is,
    List as ImmutableList
} from 'immutable';
import {
    createSelector
} from '@reduxjs/toolkit';
import concat from 'transmute/concat';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import {
    getUnpublishedMessagesForCurrentThread
} from '../../pubsub/selectors/getUnpublishedMessagesForCurrentThread';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    isSupportedMessageType
} from '../operators/isSupportedMessageType';
import {
    getCurrentThreadHistoryData
} from './getCurrentThreadHistoryData';
import {
    getTypingMessages
} from './getTypingMessages';
let lastResult;
export const getFilteredMessages = createSelector([getSelectedThread, getCurrentThreadHistoryData, getUnpublishedMessagesForCurrentThread, getTypingMessages], (currentConversation, threadData, unpublishedMessages, typingMessages) => {
    const channel = getChannelName(currentConversation);
    const threadId = getThreadId(currentConversation);
    const threadMessages = getMessages(threadData) || ImmutableList();
    const unfilteredResult = pipe(concat(threadMessages), concat(unpublishedMessages), map(wrapFailedMessage({
        threadId,
        channel
    })), concat(typingMessages))(ImmutableList());
    const newResult = unfilteredResult.size ? unfilteredResult.filter(isSupportedMessageType) : ImmutableList();
    if (!is(lastResult, newResult)) {
        lastResult = newResult;
    }
    return lastResult;
});