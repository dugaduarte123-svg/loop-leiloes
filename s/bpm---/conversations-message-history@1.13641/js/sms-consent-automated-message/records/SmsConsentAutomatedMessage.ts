import { List, Map as ImmutableMap, Record } from 'immutable';
import { SMS_CONSENT_AUTOMATED_MESSAGE } from '../constants/messageTypes';
import { SIMPLE } from '../../common-message-format/constants/contentTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
class SmsConsentAutomatedMessage extends Record({
  '@type': SMS_CONSENT_AUTOMATED_MESSAGE,
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
  subscriptionDefinitionId: null,
  text: '',
  timestamp: null
}, 'SmsConsentAutomatedMessage') {
  constructor(props) {
    const superProps = props && buildSendersFromLegacySender(props);
    super(superProps);
  }
}
export default SmsConsentAutomatedMessage;