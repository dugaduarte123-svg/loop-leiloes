import { Record, fromJS } from 'immutable';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid';
import { AWAY_MODE_CHANGE } from '../constants/messageTypes';
class AgentAvailabilityMessage extends Record({
  '@type': AWAY_MODE_CHANGE,
  agentId: null,
  awayMode: null,
  id: '',
  timestamp: null,
  updatedByAgentId: null
}, 'AgentAvailabilityMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('buildTypingMessage-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }
}
export default AgentAvailabilityMessage;