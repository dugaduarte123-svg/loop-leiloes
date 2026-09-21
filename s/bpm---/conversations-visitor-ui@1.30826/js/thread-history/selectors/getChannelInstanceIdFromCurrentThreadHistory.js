'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getCurrentThreadHistoryEntry
} from './getCurrentThreadHistoryEntry';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
export const getChannelInstanceIdFromCurrentThreadHistory = createSelector(getCurrentThreadHistoryEntry, historyEntry => {
    return historyEntry.data.messages.results.toList().filter(msg => !(msg.channelInstanceId === null || msg.channelInstanceId === undefined || msg.genericChannelId !== LIVE_CHAT_GENERIC_CHANNEL_ID)).sort((msg1, msg2) => msg1.timeStamp - msg2.timeStamp).last().channelInstanceId;
});