'use es6';

import {
    createAction
} from '@reduxjs/toolkit';
import {
    CHANNEL_CHANGE_RECEIVED
} from '../constants/pubsubActionTypes';
export const channelChangeReceived = createAction(CHANNEL_CHANGE_RECEIVED, ({
    channelChange,
    threadId
}) => ({
    payload: {
        channelChange,
        threadId
    }
}));