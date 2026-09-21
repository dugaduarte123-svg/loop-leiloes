'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getMessagesPageUri
} from '../../selectors/widgetDataSelectors/getMessagesPageUri';
import {
    buildThread
} from '../../threads/factories/buildThread';
import {
    getInitialMessageText
} from '../../selectors/widgetDataSelectors/getInitialMessageText';
import {
    setLatestMessage
} from '../../threads/operators/setLatestMessage';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    buildCommonMessage
} from 'conversations-message-history/common-message-format/operators/buildCommonMessage';
export const getStubbedThread = createSelector([getMessagesPageUri, getInitialMessageText], (messagesPageUri, initialMessageText) => {
    const latestMessage = buildCommonMessage({
        text: initialMessageText
    });
    const thread = buildThread({
        originalGenericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
        threadId: STUBBED_THREAD_ID,
        currentUrl: messagesPageUri
    });
    return setLatestMessage(latestMessage, thread);
});