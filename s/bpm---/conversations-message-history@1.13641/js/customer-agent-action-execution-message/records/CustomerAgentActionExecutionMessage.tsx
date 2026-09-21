import { List, Record } from 'immutable';
const CustomerAgentActionExecutionMessage = Record({
  '@type': 'CUSTOMER_AGENT_ACTION_EXECUTION_MESSAGE',
  ablyTs: null,
  attachments: List(),
  clientType: null,
  customerAgentUserId: null,
  echo: false,
  executedActions: List(),
  id: null,
  inReplyToMessageId: null,
  messageDeletedStatus: 'NOT_DELETED',
  senders: List(),
  timestamp: null
}, 'CustomerAgentActionExecutionMessage');
export default CustomerAgentActionExecutionMessage;