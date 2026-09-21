import { Record } from 'immutable';
import { MESSAGE_FEEDBACK_REQUEST } from '../constants/attachmentTypes';
const MessageFeedbackRequestAttachment = Record({
  '@type': MESSAGE_FEEDBACK_REQUEST,
  feedbackContext: null
}, 'MessageFeedbackRequestAttachment');
export default MessageFeedbackRequestAttachment;