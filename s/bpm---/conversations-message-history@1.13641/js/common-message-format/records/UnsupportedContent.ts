import { Record } from 'immutable';
import { UNSUPPORTED_CONTENT } from '../constants/attachmentTypes';
const UnsupportedContent = Record({
  '@type': UNSUPPORTED_CONTENT
}, 'UnsupportedContent');
export default UnsupportedContent;