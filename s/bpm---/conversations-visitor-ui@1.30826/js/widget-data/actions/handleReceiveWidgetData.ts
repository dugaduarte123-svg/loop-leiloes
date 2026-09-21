import Raven from 'raven-js';
/*  @ts-ignore Untyped Dependency  */

import bootstrapWidget from '../../actions/bootstrapWidget';
import { fetchFeedbackSurvey } from '../../feedback-survey/feedbackSurveyEnabledSlice';
/*  @ts-ignore Untyped Dependency  */
import { navigateToInitialView } from '../../navigation/actions/navigateToInitialView';
/*  @ts-ignore Untyped Dependency  */
import { fetchVisitorThreads } from '../../threads/actions/ThreadActions';
import { setThreadsSuccess } from '../../threads/actions/setThreadsSuccess';
import { getShouldFetchInitialVisitorThreads } from '../../threads/selectors/getShouldFetchInitialVisitorThreads';
import { initializeI18n } from '../../utils/initializeI18n';
import { isInPreview } from '../../utils/isInPreview';
export const handleReceiveWidgetData = ({
  data
}) => (dispatch, getState) => {
  if (data) {
    return initializeI18n({
      data
    }).then(() => {
      var _data$spamProtectionM;
      const {
        message: {
          surveyId,
          surveyType
        },
        sessionId
      } = data;
      if (surveyId !== null && surveyId !== undefined) {
        dispatch(fetchFeedbackSurvey(surveyId, sessionId, surveyType !== null && surveyType !== void 0 ? surveyType : 'CSAT')).catch(err => {
          Raven.captureException(err);
        });
      }
      dispatch(bootstrapWidget(data));
      const recaptchaToken = (_data$spamProtectionM = data.spamProtectionMetadata) === null || _data$spamProtectionM === void 0 ? void 0 : _data$spamProtectionM.token;
      if (recaptchaToken && !isInPreview()) {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaToken}`;
        document.body.appendChild(script);
      }
      const shouldFetchVisitorThreads = getShouldFetchInitialVisitorThreads(getState());
      if (shouldFetchVisitorThreads) {
        dispatch(fetchVisitorThreads()).then(() => {
          dispatch(setThreadsSuccess());
          dispatch(navigateToInitialView());
        }).catch(err => {
          Raven.captureException(err);
        });
      } else {
        dispatch(setThreadsSuccess());
        dispatch(navigateToInitialView());
      }
    }, () => {
      dispatch(bootstrapWidget(data));
    });
  }
  return Promise.resolve();
};