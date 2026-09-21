import { fromJS } from 'immutable';
import compose from 'transmute/compose';
import getIn from 'transmute/getIn';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { STATUS } from '../constants/keyPaths';
import CommonMesage from '../records/CommonMessage';
// @ts-ignore module not typed
import { buildAttachments } from './buildAttachments';
// @ts-ignore module not typed
import { buildStatus } from './buildStatus';
// @ts-ignore module not typed
import { getTimestamp } from './commonMessageFormatGetters';
import { getGenericChannelId } from './commonMessageGetters';
import { setAttachments, setId, setStatus, setTimestamp
// @ts-ignore module not typed
} from './commonMessageFormatSetters';
import { setMessageDirection, setRecipients, setSenders, setGenericChannelId } from './commonMessageSetters';
import { buildRecipients } from './buildRecipients';
import { buildSenders } from './buildSenders';
export const buildCommonMessage = (props = {}) => {
  const status = buildStatus(getIn(STATUS, props));
  const attachments = buildAttachments(props.attachments);
  const recipients = buildRecipients(props.recipients);
  const senders = buildSenders(props.senders);
  const messageDirection = props.direction || '';
  const id = 'id' in props && props.id !== undefined && props.id !== '' ? props.id : generateUuid();
  const genericChannelId = getGenericChannelId(props) || null;
  const timestamp = getTimestamp(props) || generateUniqueClientTimestamp('buildCommonMessage-timestamp');
  return compose(setId(id), setStatus(status), setAttachments(attachments), setTimestamp(timestamp), setRecipients(recipients), setSenders(senders), setMessageDirection(messageDirection), setGenericChannelId(genericChannelId))(new CommonMesage(fromJS(props)));
};