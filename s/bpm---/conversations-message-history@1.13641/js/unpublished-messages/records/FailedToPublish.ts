import { Record } from 'immutable';
import { MESSAGE_TYPE_ID, FAILED_TO_PUBLISH } from '../constants/messageTypes';
const FailedToPublish = Record({
  [MESSAGE_TYPE_ID]: FAILED_TO_PUBLISH,
  id: null,
  threadId: null,
  channel: null,
  channelName: '',
  genericChannelId: null,
  message: null,
  allowRetry: true,
  timestamp: null
}, 'FailedToPublish');
export default FailedToPublish;