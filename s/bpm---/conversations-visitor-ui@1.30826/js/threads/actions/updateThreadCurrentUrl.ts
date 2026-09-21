import { createAction } from '@reduxjs/toolkit';
import { UPDATE_THREAD_CURRENT_URL } from '../constants/actionTypes';
export const updateThreadCurrentUrl = createAction(UPDATE_THREAD_CURRENT_URL, ({
  currentUrl,
  threadId
}) => ({
  payload: {
    currentUrl,
    threadId
  }
}));