import { THREAD_REOPEN_SPLIT_MESSAGE } from '../constants/messageTypes';
import { List, Record } from 'immutable';
import OriginatingAuditContext from '../../common-message-format/records/OriginatingAuditContext';
class ThreadReopenSplitMessage extends Record({
  '@type': THREAD_REOPEN_SPLIT_MESSAGE,
  id: null,
  timestamp: null,
  echo: false,
  messageDeletedStatus: 'NOT_DELETED',
  ablyTs: null,
  originatingTicketId: null,
  splitTicketId: null,
  splitTicketCreationTimestamp: null,
  clientType: null,
  senders: List(),
  attachments: List(),
  originatingAuditContext: null
}, 'ThreadReopenSplitMessage') {
  constructor(props = {}) {
    super(Object.assign({}, props, {
      originatingAuditContext: props.originatingAuditContext ? new OriginatingAuditContext(props.originatingAuditContext) : null
    }));
  }
}
export default ThreadReopenSplitMessage;