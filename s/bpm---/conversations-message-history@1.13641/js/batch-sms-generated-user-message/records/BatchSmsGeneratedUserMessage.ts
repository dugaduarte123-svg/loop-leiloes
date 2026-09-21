import { List, Map as ImmutableMap, Record } from 'immutable';
import { BATCH_SMS_GENERATED_USER_MESSAGE } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
const BatchSmsGeneratedUserMessage = Record({
  '@type': BATCH_SMS_GENERATED_USER_MESSAGE,
  clientType: null,
  id: null,
  messageDeletedStatus: NOT_DELETED,
  richText: '',
  sender: ImmutableMap(),
  status: Status(),
  text: '',
  timestamp: null,
  threadId: null,
  channelInstanceId: null,
  genericChannelId: null,
  recipients: List(),
  senders: List(),
  direction: '',
  channelId: null,
  contentId: 0,
  objectId: 0,
  objectTypeId: ''
}, 'BatchSmsGeneratedUserMessage');
export default BatchSmsGeneratedUserMessage;