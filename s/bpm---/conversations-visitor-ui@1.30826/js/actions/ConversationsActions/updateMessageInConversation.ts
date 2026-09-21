import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export const updateMessageInConversation = createAction(ActionTypes.UPDATE_MESSAGE_IN_CONVERSATION, ({
  updated,
  channel,
  message,
  threadId
}) => ({
  payload: {
    updated,
    channel,
    message,
    threadId
  }
}));