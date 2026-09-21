import { Record } from 'immutable';
import { CONTACT } from '../constants/attachmentTypes';
const ContactMetadata = Record({
  '@type': CONTACT,
  contactProfile: {}
}, 'ContactMetadata');
export default ContactMetadata;