import { fromJS, Record } from 'immutable';
import { MESSAGE_HEADER } from '../constants/attachmentTypes';
class MessageHeaderAttachment extends Record({
  '@type': MESSAGE_HEADER,
  text: '',
  fileId: null
}, 'MessageHeaderAttachment') {
  constructor(options = {}) {
    super(fromJS(options));
  }
}
export default MessageHeaderAttachment;