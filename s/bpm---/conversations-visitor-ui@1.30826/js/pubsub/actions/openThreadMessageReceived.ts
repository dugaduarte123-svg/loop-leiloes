import { defaultMessageReceived } from '../../actions/defaultMessageReceived';
export const openThreadMessageReceived = ({
  message,
  channel,
  threadId
}) => dispatch => {
  dispatch(defaultMessageReceived(message, channel, threadId));
};