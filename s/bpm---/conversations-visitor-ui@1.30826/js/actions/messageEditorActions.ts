import { createAction } from '@reduxjs/toolkit';
import * as ActionTypes from '../constants/VisitorActionTypes';
import { getSelectedThreadId } from '../selected-thread/selectors/getSelectedThreadId';
export const setMessageEditorTextAction = createAction(ActionTypes.UPDATE_MESSAGE_EDITOR_STAGING_TEXT, stagingText => ({
  payload: stagingText
}));
export const removeMessageEditorStagingTextAction = createAction(ActionTypes.REMOVE_MESSAGE_EDITOR_STAGING_TEXT, selectedThreadId => ({
  payload: selectedThreadId
}));
export const setMessageEditorStagingText = stagingText => {
  return (dispatch, getState) => {
    dispatch(setMessageEditorTextAction({
      stagingText,
      threadId: getSelectedThreadId(getState())
    }));
  };
};
export const removeMessageEditorStagingText = () => {
  return (dispatch, getState) => {
    dispatch(removeMessageEditorStagingTextAction(getSelectedThreadId(getState())));
  };
};