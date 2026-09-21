import Raven from 'raven-js';
import { fetchFeedbackSurveyEnabled } from './fetchFeedbackSurvey';
import { CSAT } from './surveyTypes';
import { createSlice } from '@reduxjs/toolkit';
import get from 'transmute/get';
const initialState = false;
const feedbackSurveyEnabledSlice = createSlice({
  name: 'feedbackSurveyEnabled',
  initialState,
  reducers: {
    updateFeedbackSurveyEnabled: (_, action) => {
      return action.payload;
    }
  }
});
export const {
  updateFeedbackSurveyEnabled
} = feedbackSurveyEnabledSlice.actions;
export function fetchFeedbackSurvey(id, sessionId, surveyType = CSAT) {
  return dispatch => {
    return fetchFeedbackSurveyEnabled({
      id,
      sessionId,
      surveyType
    }).then(({
      enabled
    }) => {
      dispatch(updateFeedbackSurveyEnabled(enabled));
    }).catch(error => {
      Raven.captureException(error);
    });
  };
}
export const getFeedbackSurveyEnabled = data => get('feedbackSurveyEnabled', data);
export default feedbackSurveyEnabledSlice.reducer;