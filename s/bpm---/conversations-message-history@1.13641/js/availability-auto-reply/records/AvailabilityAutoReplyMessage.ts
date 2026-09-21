import { Record, Map as ImmutableMap, fromJS, List } from 'immutable';
import Status from '../../common-message-format/records/Status';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module '../.... Remove this comment to see the full error message
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { AVAILABILITY_AUTO_REPLY } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid';
import { OUTGOING } from '../../common-message-format/constants/messageDirections';
class AvailabilityAutoReplyMessage extends Record({
  '@type': AVAILABILITY_AUTO_REPLY,
  id: null,
  text: '',
  timestamp: null,
  sender: ImmutableMap(),
  status: Status(),
  messageDeletedStatus: NOT_DELETED,
  direction: OUTGOING,
  genericChannelId: null,
  channelInstanceId: null,
  senders: List(),
  recipients: List()
}, 'AvailabilityAutoReplyMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      status: buildStatus(props.status),
      timestamp: props.timestamp || generateUniqueClientTimestamp('AvailabilityAutoReplyMessage-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }
}
export default AvailabilityAutoReplyMessage;