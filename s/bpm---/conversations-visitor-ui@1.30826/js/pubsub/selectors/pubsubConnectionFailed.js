'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    isFailed
} from '../../constants/asyncStatuses';
import {
    getAsyncPubSubClient
} from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
export const pubsubConnectionFailed = createSelector([getAsyncPubSubClient], isFailed);