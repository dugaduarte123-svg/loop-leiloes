'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    isUninitialized,
    isSucceeded,
    isStarted,
    isFailed
} from '../../constants/asyncStatuses';
import {
    isClientReady
} from 'conversations-internal-pub-sub/redux/operators/isClientReady';
import {
    getAsyncPubSubClient
} from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import {
    getAsyncSubscriptions
} from 'conversations-internal-pub-sub/redux/selectors/subscriptionGetters';
import {
    hasPersistedThreads
} from '../../threads/selectors/hasPersistedThreads';
import {
    getAsyncStagedThread
} from '../../thread-create/selectors/stagedThreadSelectors';
import {
    getThreadsAsyncData
} from '../../threads/selectors/getThreadsAsyncData';
import {
    getCurrentThreadHistoryEntry
} from '../../thread-history/selectors/getCurrentThreadHistoryEntry';
import {
    getMessageEditorText
} from '../../message-editor/selectors/getMessageEditorText';
export const canPublish = createSelector([getAsyncStagedThread, getAsyncPubSubClient, hasPersistedThreads, getAsyncSubscriptions, getThreadsAsyncData, getCurrentThreadHistoryEntry, getMessageEditorText], (asyncStagedThread, asyncPubSubClient, persistedThreads, asyncSubscriptions, threads, currentThreadEntry, messageEditorText) => {
    // Block publish while creating a new thread
    if (isStarted(asyncStagedThread)) return false;

    // Enable publish when the visitor has no persisted threads and has not started creating a thread
    if (isUninitialized(asyncStagedThread) && !persistedThreads) return true;
    if (isFailed(asyncStagedThread) && messageEditorText) return true;

    // disable publish while getting threads and threadhistories
    const areThreadsBeingFetched = !isSucceeded(threads) && !isUninitialized(threads) || !isSucceeded(currentThreadEntry) && !isUninitialized(currentThreadEntry);
    if (areThreadsBeingFetched) {
        return false;
    }

    // Enable publish when the visitor has persisted threads and pubsub is ready
    if (persistedThreads && isClientReady(asyncPubSubClient) && isSucceeded(asyncSubscriptions)) return true;

    // Enable publish when the visitor has successfully created a thread and pubsub is ready
    if (isSucceeded(asyncStagedThread) && isClientReady(asyncPubSubClient) && isSucceeded(asyncSubscriptions)) {
        return true;
    }
    return false;
});