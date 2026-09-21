import { createAction } from '@reduxjs/toolkit';
import { GENERIC_CHANNEL_CHANGE_RECEIVED } from '../constants/pubsubActionTypes';
export const genericChannelChangeReceived = createAction(GENERIC_CHANNEL_CHANGE_RECEIVED, ({
  threadId
}) => ({
  payload: {
    threadId
  }
}));