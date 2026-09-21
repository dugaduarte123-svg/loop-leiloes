'use es6';

import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import {
    findLastConversationalMessage
} from 'conversations-message-history/thread-history/operators/findLastConversationalMessage';
import {
    buildThread
} from '../../threads/factories/buildThread';
import {
    getTimestamp
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
export const buildCreatedThread = ({
    channelDetails,
    messagesPageUri,
    threadHistory,
    threadId
}) => buildThread({
    channelDetails,
    currentUrl: messagesPageUri,
    latestMessageTimestamp: getTimestamp(findLastConversationalMessage(threadHistory)),
    originalGenericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
    status: ChatFilterOptions.STARTED,
    threadId
});