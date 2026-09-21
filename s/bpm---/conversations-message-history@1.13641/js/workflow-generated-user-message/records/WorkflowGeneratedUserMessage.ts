import { List, Map as ImmutableMap, Record } from 'immutable';
import { WORKFLOW_GENERATED_USER_MESSAGE } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
const WorkflowGeneratedUserMessage = Record({
  '@type': WORKFLOW_GENERATED_USER_MESSAGE,
  attachments: List(),
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
  flowId: 0,
  objectId: 0,
  objectTypeId: ''
}, 'WorkflowGeneratedUserMessage');
export default WorkflowGeneratedUserMessage;