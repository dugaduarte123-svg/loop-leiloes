import { Record, fromJS } from 'immutable';
import { TICKET_CREATION_FAILURE } from '../constants/messageTypes';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
class TicketCreationFailureMessage extends Record({
  '@type': TICKET_CREATION_FAILURE,
  id: null,
  timestamp: null
}, 'TicketCreationFailureMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('ticketCreationFailure-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }
}
export default TicketCreationFailureMessage;