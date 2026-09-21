import { createAction } from '@reduxjs/toolkit';
import { APP_IN_FOREGROUND, APP_IN_BACKGROUND } from '../constants/VisitorActionTypes';
export const setAppInBackground = createAction(APP_IN_BACKGROUND);
export const setAppInForeground = createAction(APP_IN_FOREGROUND);
export function setWindowVisible(isVisible) {
  return dispatch => {
    if (isVisible) {
      dispatch(setAppInForeground());
    } else {
      dispatch(setAppInBackground());
    }
  };
}