import { createSelector } from '@reduxjs/toolkit';
import { getData } from '../../constants/asyncStatuses';
import { getThreadsAsyncData } from './getThreadsAsyncData';
export const getThreads = createSelector([getThreadsAsyncData], getData);