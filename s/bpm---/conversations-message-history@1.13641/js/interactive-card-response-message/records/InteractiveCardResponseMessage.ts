import { List as ImmutableList, Map as ImmutableMap, Record } from 'immutable';
import { INTERACTIVE_CARD_RESPONSE_MESSAGE } from '../constants/messageTypes';
import { SIMPLE } from '../../common-message-format/constants/contentTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
class InteractiveCardResponseMessage extends Record({
  '@type': INTERACTIVE_CARD_RESPONSE_MESSAGE,
  ablyTs: null,
  attachments: ImmutableList(),
  cardId: null,
  cardInstanceId: null,
  cardInstanceVersion: null,
  channelInstanceId: null,
  clientType: null,
  contentType: SIMPLE,
  context: {},
  direction: '',
  directReplyToMessageId: null,
  dynamicTexts: {},
  echo: null,
  errorReason: null,
  genericChannelId: null,
  hiddenBy: null,
  id: null,
  inReplyToId: null,
  integrationAppId: null,
  locale: null,
  messageDeletedStatus: NOT_DELETED,
  recipients: ImmutableList(),
  richText: '',
  sender: ImmutableMap(),
  senders: ImmutableList(),
  stateName: null,
  status: Status(),
  template: null,
  templateVersion: null,
  text: '',
  timestamp: null
}, 'InteractiveCardResponseMessage') {
  constructor(props) {
    const senderProps = props && buildSendersFromLegacySender(props);
    super(senderProps !== null && senderProps !== void 0 ? senderProps : undefined);
  }
}
export default InteractiveCardResponseMessage;