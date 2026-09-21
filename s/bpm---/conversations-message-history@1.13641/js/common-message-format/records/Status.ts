import { Record } from 'immutable';
import get from 'transmute/get';
import SendFailure from './SendFailure';
const Status = Record({
  messageStatus: null,
  timestamp: null,
  sendFailure: null
}, 'Status');
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  if (!props) return Status();
  const messageStatus = get('messageStatus', props) || null;
  const timestampProp = get('timestamp', props);
  const timestamp = typeof timestampProp === 'number' ? timestampProp : null;
  const sendFailureProp = get('sendFailure', props) || null;
  const sendFailure = sendFailureProp && SendFailure(sendFailureProp);
  return Status({
    messageStatus,
    timestamp,
    sendFailure
  });
}