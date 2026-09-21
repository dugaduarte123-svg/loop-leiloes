import { createAction } from '@reduxjs/toolkit';
import { TOGGLE_INITIAL_MESSAGE_BUBBLE } from '../constants/initialMessageBubbleActionTypes';
export const toggleInitialMessageBubble = createAction(TOGGLE_INITIAL_MESSAGE_BUBBLE, (visible, closedByUser = false) => ({
  payload: {
    visible,
    closedByUser
  }
}));