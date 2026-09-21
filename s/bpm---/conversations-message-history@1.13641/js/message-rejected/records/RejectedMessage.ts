import { Record, fromJS } from 'immutable';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { MESSAGE_REJECTED } from '../constants/messageTypes';
class RejectedMessage extends Record({
  '@type': MESSAGE_REJECTED,
  id: null,
  timestamp: null,
  echo: false,
  rejectedMessageId: null,
  rejectionReason: null,
  rejectionDetails: null
}, 'RejectedMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('RejectedMessage-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }
}
export default RejectedMessage;