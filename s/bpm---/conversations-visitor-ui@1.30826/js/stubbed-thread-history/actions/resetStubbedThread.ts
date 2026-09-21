import { createAction } from '@reduxjs/toolkit';
import { RESET_STUBBED_THREAD } from '../constants/StubbedThreadHistoryActionTypes';
export const resetStubbedThread = createAction(RESET_STUBBED_THREAD, (shouldRetainFailureState = false) => ({
  payload: {
    shouldRetainFailureState
  }
}));