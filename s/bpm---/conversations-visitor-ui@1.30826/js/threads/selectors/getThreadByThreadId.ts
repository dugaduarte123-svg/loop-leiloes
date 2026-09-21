import get from 'transmute/get';
import { createSelector } from '@reduxjs/toolkit';
import { getThreads } from './getThreads';
const threadIdFromProps = (state, {
  threadId
}) => {
  return threadId;
};
export const getThreadByThreadId = createSelector([getThreads, threadIdFromProps], (threadsData, threadId) => {
  return get(threadId, threadsData);
});