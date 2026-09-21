import { Map as ImmutableMap, List as ImmutableList, Record } from 'immutable';
import get from 'transmute/get';
import pipe from 'transmute/pipe';
import set from 'transmute/set';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Recipient from '../../common-message-format/records/Recipient';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
import { CUSTOMER_AGENT_FEEDBACK_MESSAGE } from '../constants/messageTypes';
class CustomerAgentFeedbackMessage extends Record({
  '@type': CUSTOMER_AGENT_FEEDBACK_MESSAGE,
  ablyTs: null,
  attachments: ImmutableList(),
  channelInstanceId: null,
  clientType: null,
  direction: '',
  echo: false,
  genericChannelId: null,
  hiddenBy: null,
  id: null,
  inResponseToMessageId: null,
  messageDeletedStatus: NOT_DELETED,
  recipients: ImmutableList(),
  redactingFeedbackMessageId: null,
  richText: '',
  sender: ImmutableMap(),
  senders: ImmutableList(),
  status: Status(),
  text: '',
  timestamp: null,
  type: null
}, 'CustomerAgentFeedbackMessage') {
  constructor(props = {}) {
    const propsWithSenders = buildSendersFromLegacySender(props);
    const status = Status(get('status', propsWithSenders) || {});
    const recipients = ImmutableList((get('recipients', propsWithSenders) || []).filter(Boolean).map(recipient => Recipient(recipient)));
    super(pipe(set('status', status), set('recipients', recipients))(propsWithSenders));
  }
}
export default CustomerAgentFeedbackMessage;