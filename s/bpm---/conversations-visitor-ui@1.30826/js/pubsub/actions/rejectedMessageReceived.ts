import Raven from 'raven-js';
import { getRejectedMessageId, getRejectionReason } from 'conversations-message-history/message-rejected/operators/messageRejectedGetters';
import { setRejectedMessage } from '../reducers/rejectedMessagesSlice';
export const rejectedMessageReceived = ({
  message,
  channel,
  threadId
}) => dispatch => {
  const rejectedMessageId = getRejectedMessageId(message);
  const rejectionReason = getRejectionReason(message);
  Raven.captureMessage('rejected-message-received', {
    level: 'warning',
    extra: {
      threadId,
      channel,
      rejectedMessageId,
      rejectionReason
    }
  });
  if (!rejectedMessageId) {
    return;
  }
  dispatch(setRejectedMessage({
    rejectedMessageId,
    rejectionReason: rejectionReason || 'Message rejected',
    threadId
  }));
};