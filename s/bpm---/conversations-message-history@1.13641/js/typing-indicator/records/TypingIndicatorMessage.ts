import { Map as ImmutableMap, Record, List } from 'immutable';
import get from 'transmute/get';
import pipe from 'transmute/pipe';
import set from 'transmute/set';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Recipient from '../../common-message-format/records/Recipient';
import Status from '../../common-message-format/records/Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { TYPING } from '../constants/messageTypes';
export const TYPING_MESSAGE_STYLE = {
  TYPING: 'TYPING',
  THINKING: 'THINKING',
  STILL_THINKING: 'STILL_THINKING'
};
class TypingIndicatorMessage extends Record({
  '@type': TYPING,
  id: null,
  timestamp: null,
  echo: false,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  clientType: null,
  status: Status(),
  genericChannelId: null,
  senders: List(),
  recipients: List(),
  typingMessageTimeoutSeconds: null,
  style: TYPING_MESSAGE_STYLE.TYPING,
  shouldDisableUserInput: false,
  label: null
}, 'TypingIndicatorMessage') {
  constructor(props = {}) {
    const propsWithSenders = buildSendersFromLegacySender(props);
    const id = get('id', props) || generateUuid();
    const timestamp = get('timestamp', props) || generateUniqueClientTimestamp('buildTypingMessage-timestamp');
    const statusProp = get('status', props);
    const status = Status(statusProp || {});
    const recipientsProp = get('recipients', props) || [];
    const recipients = List(recipientsProp.filter(Boolean).map(recipient => Recipient(recipient)));
    const typingMessageTimeoutSeconds = get('typingMessageTimeoutSeconds', props) || null;
    const style = get('style', props) || TYPING_MESSAGE_STYLE.TYPING;
    const shouldDisableUserInput = get('shouldDisableUserInput', props) || false;
    const label = get('label', props) || null;
    const superProps = pipe(set('id', id), set('timestamp', timestamp), set('status', status), set('recipients', recipients), set('typingMessageTimeoutSeconds', typingMessageTimeoutSeconds), set('style', style), set('shouldDisableUserInput', shouldDisableUserInput), set('label', label))(propsWithSenders);
    super(superProps);
  }
}
export default TypingIndicatorMessage;