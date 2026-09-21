import { buildSenders } from '../../common-message-format/operators/buildSenders';
import { buildRecipients } from '../../common-message-format/operators/buildRecipients';
import compose from 'transmute/compose';
import { setRecipients, setSenders } from '../../common-message-format/operators/commonMessageSetters';
// @ts-ignore module not typed
import FeedbackSurveyMessage from '../records/FeedbackSurveyMessage';
import { fromJS } from 'immutable';
export const buildFeedbackSurveyMessage = (props = {}) => {
  const senders = buildSenders(props.senders);
  const recipients = buildRecipients(props.recipients);
  return compose(setRecipients(recipients), setSenders(senders))(new FeedbackSurveyMessage(fromJS(props)));
};