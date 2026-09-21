import { Record } from 'immutable';
import { UNKNOWN } from '../../common-message-format/constants/clientTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { THREAD_PAUSED_ON_GENERIC_CHANNEL } from '../constants/messageTypes';
const ThreadPausedOnGenericChannelMessage = Record({
  '@type': THREAD_PAUSED_ON_GENERIC_CHANNEL,
  id: '',
  timestamp: 0,
  messageDeletedStatus: NOT_DELETED,
  isPausedOn: 0,
  clientType: UNKNOWN
}, 'ThreadPausedOnGenericChannelMessage');
export default ThreadPausedOnGenericChannelMessage;