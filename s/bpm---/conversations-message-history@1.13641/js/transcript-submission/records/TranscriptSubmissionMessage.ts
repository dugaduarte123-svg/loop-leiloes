import { Record, fromJS } from 'immutable';
import { CHAT_TRANSCRIPT_SENT } from '../constants/messageTypes';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import OriginatingAuditContext from '../../common-message-format/records/OriginatingAuditContext';
class TranscriptSubmissionMessage extends Record({
  '@type': CHAT_TRANSCRIPT_SENT,
  id: null,
  timestamp: null,
  subject: null,
  emailAddress: null,
  originatingAuditContext: null
}, 'TranscriptSubmissionMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      subject: props.subject || '',
      emailAddress: props.emailAddress || '',
      timestamp: props.timestamp || generateUniqueClientTimestamp('TranscriptSubmissionMessage-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(Object.assign({}, map.toObject(), {
      originatingAuditContext: props.originatingAuditContext ? new OriginatingAuditContext(props.originatingAuditContext) : null
    }));
  }
}
export default TranscriptSubmissionMessage;