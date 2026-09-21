import { createSelector } from '@reduxjs/toolkit';
import { getInitialMessageBubbleVisible } from './getInitialMessageBubbleVisible';
// @ts-ignore Untyped JS module
import { getShowInitialMessage } from '../../selectors/getShowInitialMessage';
import { getIsOpen } from '../../selectors/getIsOpen';
import { hasPersistedThreads } from '../../threads/selectors/hasPersistedThreads';
import { getThreadsAsyncData } from '../../threads/selectors/getThreadsAsyncData';
import { isSucceeded, isUninitialized, isStarted } from '../../constants/asyncStatuses';
export const getShowInitialMessageBubble = createSelector([getShowInitialMessage, getInitialMessageBubbleVisible, getIsOpen, getThreadsAsyncData, hasPersistedThreads], (showInitialMessage, initialMessageBubbleVisible, isOpen, threadsAsyncData, persistedThreads) => {
  // Don't show bubble while loading thread data
  if (isUninitialized(threadsAsyncData) || isStarted(threadsAsyncData)) {
    return false;
  }
  // Don't show bubble if persistedThreads exist
  if (isSucceeded(threadsAsyncData) && persistedThreads) return false;
  return showInitialMessage && initialMessageBubbleVisible && !isOpen;
});