import { fromJS } from 'immutable';
import compose from 'transmute/compose';
import getIn from 'transmute/getIn';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { STATUS } from '../../common-message-format/constants/keyPaths';
import { REPLACE, RESCIND } from '../constants/partialMessageTypes';
import PartialMessage from '../records/PartialMessage';
// @ts-ignore module not typed
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { getTimestamp
// @ts-ignore module not typed
} from '../../common-message-format/operators/commonMessageFormatGetters';
import { getGenericChannelId, getCompletedMessageId, getCompletedMessageTimestamp, getPartialOrdinal, getPartialMessageType } from '../operators/partialMessageGetters';
import { setId, setStatus, setTimestamp
// @ts-ignore module not typed
} from '../../common-message-format/operators/commonMessageFormatSetters';
import { setMessageDirection, setRecipients, setSenders, setGenericChannelId } from '../../common-message-format/operators/commonMessageSetters';
import { buildRecipients } from '../../common-message-format/operators/buildRecipients';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
import { setCompletedMessageId, setCompletedMessageTimestamp, setPartialOrdinal, setPartialMessageType } from './partialMessageSetters';
const normalizePartialMessageType = raw => {
  const value = typeof raw === 'string' ? raw : raw && typeof raw === 'object' && 'value' in raw ? raw.value : undefined;
  return value === RESCIND ? RESCIND : REPLACE;
};
export const buildPartialMessage = (props = {}) => {
  const status = buildStatus(getIn(STATUS, props));
  const recipients = buildRecipients(props.recipients);
  const senders = buildSenders(props.senders);
  const messageDirection = props.direction || '';
  const id = 'id' in props && props.id !== undefined && props.id !== '' ? props.id : generateUuid();
  const genericChannelId = getGenericChannelId(props) || null;
  const completedMessageId = getCompletedMessageId(props);
  const timeStamp = getTimestamp(props) || generateUniqueClientTimestamp('buildPartialMessage-timestamp');
  const completedMessageTimestamp = getCompletedMessageTimestamp(props) || getTimestamp(props) || generateUniqueClientTimestamp('buildPartialMessage-timestamp');
  const partialOrdinal = getPartialOrdinal(props);
  const partialMessageType = normalizePartialMessageType(getPartialMessageType(props));
  return compose(setId(id), setCompletedMessageId(completedMessageId), setPartialOrdinal(partialOrdinal), setPartialMessageType(partialMessageType), setStatus(status), setTimestamp(timeStamp), setCompletedMessageTimestamp(completedMessageTimestamp), setRecipients(recipients), setSenders(senders), setMessageDirection(messageDirection), setGenericChannelId(genericChannelId))(new PartialMessage(fromJS(props)));
};