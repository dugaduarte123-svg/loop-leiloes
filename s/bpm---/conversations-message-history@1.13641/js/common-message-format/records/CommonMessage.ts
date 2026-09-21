import { List, Map as ImmutableMap, Record } from 'immutable';
import { COMMON_MESSAGE } from '../constants/messageTypes';
import { SIMPLE } from '../constants/contentTypes';
import { NOT_DELETED } from '../constants/messageDeleteStatus';
import Status from './Status';
import { buildSendersFromLegacySender } from '../../senders/operators/buildSendersFromLegacySender';
import { CommonMessageTypename } from '../../../__generated__/chirp/com/hubspot/cv/tickets/timeline/rpc/TicketTimelineRpc';
import isRecord from 'transmute/isRecord';
// @ts-ignore Untyped
import { getType } from '../operators/commonMessageFormatGetters';
class CommonMessage extends Record({
  '@type': COMMON_MESSAGE,
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
  sensitivityType: 'NOT_SENSITIVE'
}, 'CommonMessage') {
  constructor(props) {
    const superProps = props && buildSendersFromLegacySender(props);
    super(superProps);
  }
}
export function isCommonMessageRecord(message) {
  return isRecord(message) && getType(message) === COMMON_MESSAGE;
}
export function isCommonMessageChirp(message) {
  return !isRecord(message) && message.__typename === CommonMessageTypename;
}
export default CommonMessage;