import { List as ImmutableList, Map as ImmutableMap, Record } from 'immutable';
import { INTERACTIVE_CARD_REQUEST_MESSAGE } from '../constants/messageTypes';
import { SIMPLE } from '../../common-message-format/constants/contentTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
class InteractiveCardRequestMessage extends Record({
  '@type': INTERACTIVE_CARD_REQUEST_MESSAGE,
  ablyTs: null,
  actionName: null,
  attachments: ImmutableList(),
  cardId: null,
  cardInstanceId: null,
  cardInstanceVersion: null,
  currentStateName: null,
  channelInstanceId: null,
  clientType: null,
  contentType: SIMPLE,
  context: {},
  direction: '',
  directReplyToMessageId: null,
  echo: null,
  genericChannelId: null,
  hiddenBy: null,
  id: null,
  inReplyToId: null,
  integrationAppId: null,
  messageDeletedStatus: NOT_DELETED,
  recipients: ImmutableList(),
  richText: '',
  sender: ImmutableMap(),
  senders: ImmutableList(),
  status: Status(),
  text: '',
  timestamp: null
}, 'InteractiveCardRequestMessage') {
  constructor(props) {
    const senderProps = props && buildSendersFromLegacySender(props);
    super(senderProps !== null && senderProps !== void 0 ? senderProps : undefined);
  }
}
export default InteractiveCardRequestMessage;