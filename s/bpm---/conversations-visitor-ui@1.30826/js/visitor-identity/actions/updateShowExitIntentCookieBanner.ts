import { createAction } from '@reduxjs/toolkit';
import { UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER } from '../constants/ActionTypes';
export const updateShowExitIntentCookieBanner = createAction(UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER, visible => ({
  payload: {
    visible
  }
}));