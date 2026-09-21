import { createSelector } from '@reduxjs/toolkit';
import { getMessages } from 'conversations-message-history/thread-history/operators/getters';
import { serialize } from 'conversations-message-history/common-message/serializers/messageSerializer';
import { isTypingMessage } from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
import { isStarted, isFailed, getData } from '../../constants/asyncStatuses';
export const getAsyncStagedThread = state => state.stagedThread;
export const isCreatingThread = createSelector(getAsyncStagedThread, isStarted);
export const didFailToCreateThread = createSelector(getAsyncStagedThread, isFailed);
export const getStagedThreadHistory = createSelector(getAsyncStagedThread, getData);
export const getVisitorInitialThreadHistory = createSelector(getStagedThreadHistory, history =>
//  @ts-ignore TS Migration
getMessages(history).toList().filterNot(isTypingMessage).map(serialize).toJS());