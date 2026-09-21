import { List, Map as ImmutableMap, Record } from 'immutable';
import { PARTIAL_MESSAGE } from '../constants/messageTypes';
import { REPLACE } from '../constants/partialMessageTypes';
import { SIMPLE } from '../../common-message-format/constants/contentTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
class PartialMessage extends Record({
  '@type': PARTIAL_MESSAGE,
  attachments: List(),
  clientType: null,
  contentType: SIMPLE,
  directReplyToMessageId: null,
  id: null,
  inReplyToId: null,
  messageDeletedStatus: NOT_DELETED,
  richText: '',
  sender: ImmutableMap(),
  status: Status(),
  text: '',
  timestamp: null,
  channelInstanceId: null,
  genericChannelId: null,
  integrationId: null,
  recipients: List(),
  senders: List(),
  direction: '',
  hiddenBy: null,
  completedMessageId: null,
  completedMessageTimestamp: null,
  partialOrdinal: 0,
  partialMessageType: REPLACE
}, 'PartialMessage') {
  constructor(props) {
    const superProps = props && buildSendersFromLegacySender(props);
    super(superProps);
  }
}
export default PartialMessage;