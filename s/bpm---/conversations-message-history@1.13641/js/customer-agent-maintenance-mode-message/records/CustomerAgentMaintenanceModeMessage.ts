import { List, Map as ImmutableMap, Record } from 'immutable';
import { CUSTOMER_AGENT_MAINTENANCE_MODE_MESSAGE } from '../constants/messageTypes';
import { SIMPLE } from '../../common-message-format/constants/contentTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
class CustomerAgentMaintenanceModeMessage extends Record({
  '@type': CUSTOMER_AGENT_MAINTENANCE_MODE_MESSAGE,
  ablyTs: null,
  attachments: List(),
  channelInstanceId: null,
  clientType: null,
  contentType: SIMPLE,
  direction: '',
  directReplyToMessageId: null,
  echo: null,
  genericChannelId: null,
  hiddenBy: null,
  id: null,
  inReplyToId: null,
  integrationAppId: null,
  messageDeletedStatus: NOT_DELETED,
  recipients: List(),
  richText: '',
  sender: ImmutableMap(),
  senders: List(),
  status: Status(),
  text: '',
  timestamp: null
}, 'CustomerAgentMaintenanceModeMessage') {
  constructor(props) {
    const superProps = props && buildSendersFromLegacySender(props);
    super(superProps);
  }
}
export default CustomerAgentMaintenanceModeMessage;