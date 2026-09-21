import { List, Map as ImmutableMap, Record } from 'immutable';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { FEEDBACK_SUBMISSION } from '../constants/messageTypes';
const FeedbackSubmissionMessage = Record({
  '@type': FEEDBACK_SUBMISSION,
  attachments: List(),
  feedbackTransactionId: null,
  id: null,
  messageDeletedStatus: NOT_DELETED,
  recipients: List(),
  richText: '',
  sender: ImmutableMap(),
  senders: List(),
  status: Status(),
  text: '',
  threadId: null,
  timestamp: null,
  submissionId: null,
  direction: '',
  channelInstanceId: null,
  genericChannelId: null
}, 'FeedbackSubmissionMessage');
export default FeedbackSubmissionMessage;