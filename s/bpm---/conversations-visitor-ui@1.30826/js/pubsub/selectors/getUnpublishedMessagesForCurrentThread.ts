import { getData } from '../../constants/asyncStatuses';
import { createSelector } from '@reduxjs/toolkit';

// @ts-ignore Untyped import
import { getCurrentThreadId } from '../../thread-history/selectors/getCurrentThreadId';
// @ts-ignore Untyped import
import { getSortedMessagesByThreadId } from '../operators/getSortedMessagesByThreadId';
import { getUnpublishedMessages } from './getUnpublishedMessages';
export const getUnpublishedMessagesForCurrentThread = createSelector([getUnpublishedMessages, getCurrentThreadId], (unpublishedMessages, threadId) => {
  const messages = unpublishedMessages.map(getData);
  return getSortedMessagesByThreadId(messages, threadId);
});