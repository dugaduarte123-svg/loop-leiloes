import { createAction } from '@reduxjs/toolkit';
import { STAGE_MESSAGE_ON_STUBBED_THREAD } from '../constants/StubbedThreadHistoryActionTypes';
export const stageMessageOnStubbedThread = createAction(STAGE_MESSAGE_ON_STUBBED_THREAD, (message, shouldRetainFailureState = false) => ({
  payload: {
    message,
    shouldRetainFailureState
  }
}));