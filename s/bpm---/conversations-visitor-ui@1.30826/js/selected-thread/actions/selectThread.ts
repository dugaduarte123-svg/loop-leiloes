import { createAction } from '@reduxjs/toolkit';
import { SELECT_THREAD } from '../constants/selectedThreadActionTypes';
export const selectThread = createAction(SELECT_THREAD, threadId => ({
  payload: {
    threadId
  }
}));