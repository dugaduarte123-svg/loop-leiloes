import noAuthHttp from '../http/noAuthApiClient';
export const fetchFeedbackSurveyEnabled = ({
  id,
  sessionId,
  surveyType
}) => {
  return noAuthHttp.get(`livechat-public/v1/feedback/survey/${surveyType}/${id}`, {
    query: {
      sessionId
    }
  });
};