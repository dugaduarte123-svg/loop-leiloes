import filter from 'transmute/filter';
import { createSelector } from '@reduxjs/toolkit';

// @ts-ignore Untyped import
import { getThreadList } from './getThreadList';
import { isStarted } from '../operators/isStarted';
import { getHasChannelSwitchedToEmail } from '../operators/threadGetters';
export const getMostRecentNonTransferredOpenThread = createSelector([getThreadList], threads => {
  return filter(thread => isStarted(thread) && !getHasChannelSwitchedToEmail(thread), threads).first();
});