import { Record, Map as ImmutableMap, fromJS } from 'immutable';
import { READ_THREAD } from '../constants/messageTypes';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUuid } from '../../util/generateUuid';
class ReadThreadMessage extends Record({
  '@type': READ_THREAD,
  id: null,
  timestamp: null,
  echo: false,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  clientType: null
}, 'ReadThreadMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid()
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }
}
export default ReadThreadMessage;