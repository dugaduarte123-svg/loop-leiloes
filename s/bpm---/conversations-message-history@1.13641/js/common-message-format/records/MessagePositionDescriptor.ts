import { Record, Map as ImmutableMap } from 'immutable';
import { MESSAGE_POSITION_DESCRIPTOR } from '../constants/attachmentTypes';
const MessagePositionDescriptor = Record({
  '@type': MESSAGE_POSITION_DESCRIPTOR,
  descriptors: ImmutableMap()
}, 'MessagePositionDescriptor');
export default MessagePositionDescriptor;