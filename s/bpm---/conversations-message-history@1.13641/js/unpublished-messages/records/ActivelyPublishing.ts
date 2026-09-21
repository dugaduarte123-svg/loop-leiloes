import { Record } from 'immutable';
import { ACTIVELY_PUBLISHING } from '../constants/messageTypes';
const ActivelyPublishing = Record({
  '@type': ACTIVELY_PUBLISHING,
  threadId: null,
  channel: null,
  message: null,
  timestamp: null
}, 'ActivelyPublishing');
export default ActivelyPublishing;