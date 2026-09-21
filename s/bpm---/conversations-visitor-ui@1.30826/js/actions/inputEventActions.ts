import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../constants/VisitorActionTypes';
export const onInputFocusAction = createAction(ActionTypes.USER_INPUT_ON_FOCUS, inputFocus => ({
  payload: {
    widgetInputIsOnFocus: inputFocus
  }
}));
export function toggleOnAndOffInputFocus(inputFocus) {
  return dispatch => {
    dispatch(onInputFocusAction(inputFocus));
  };
}