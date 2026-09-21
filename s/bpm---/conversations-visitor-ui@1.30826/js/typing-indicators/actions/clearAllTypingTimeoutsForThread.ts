import { createAction } from '@reduxjs/toolkit';
import { CLEAR_ALL_TYPING_TIMEOUTS_FOR_THREAD } from '../constants/typingIndicatorActionTypes';
export const clearAllTypingTimeoutsForThread = createAction(CLEAR_ALL_TYPING_TIMEOUTS_FOR_THREAD, threadId => ({
  payload: {
    threadId
  }
}));