'use es6';

import {
    getData
} from '../../constants/asyncStatuses';
import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    createSelector
} from '@reduxjs/toolkit';
import {
    threadFromProps
} from '../../threads/selectors/threadFromProps';
import {
    getSortedMessagesByThreadId
} from '../operators/getSortedMessagesByThreadId';
import {
    getUnpublishedMessages
} from './getUnpublishedMessages';
export const unpublishedMessagesForThread = createSelector([getUnpublishedMessages, threadFromProps], (unpublishedMessages, thread) => {
    const threadId = getThreadId(thread);
    const messages = unpublishedMessages.map(getData);
    return getSortedMessagesByThreadId(messages, threadId);
});