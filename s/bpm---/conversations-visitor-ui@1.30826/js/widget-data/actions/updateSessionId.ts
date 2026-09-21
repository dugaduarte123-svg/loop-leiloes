import { createAction } from '@reduxjs/toolkit';
import { UPDATE_SESSION_ID } from '../constants/actionTypes';
export const updateSessionId = createAction(UPDATE_SESSION_ID, sessionId => ({
  payload: {
    sessionId
  }
}));