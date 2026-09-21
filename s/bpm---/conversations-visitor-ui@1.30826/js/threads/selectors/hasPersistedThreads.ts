import { createSelector } from '@reduxjs/toolkit';
import { getThreads } from './getThreads';
export const hasPersistedThreads = createSelector([getThreads], threads => !!(threads !== null && threads !== void 0 && threads.size));