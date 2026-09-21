import { createSelector } from '@reduxjs/toolkit';
import { getOpenThreads } from './getOpenThreads';
export const hasOpenThread = createSelector([getOpenThreads], openThreads => {
  return openThreads.size > 0;
});