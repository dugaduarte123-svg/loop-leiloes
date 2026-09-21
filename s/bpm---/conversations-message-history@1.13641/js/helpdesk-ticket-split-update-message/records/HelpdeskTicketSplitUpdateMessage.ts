import { HELP_DESK_TICKET_SPLIT_UPDATE_MESSAGE } from '../constants/messageTypes';
import { List, Record } from 'immutable';
import OriginatingAuditContext from '../../common-message-format/records/OriginatingAuditContext';
class HelpdeskTicketSplitUpdateMessage extends Record({
  '@type': HELP_DESK_TICKET_SPLIT_UPDATE_MESSAGE,
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
}, 'HelpdeskTicketSplitUpdateMessage') {
  constructor(props = {}) {
    super(Object.assign({}, props, {
      originatingAuditContext: props.originatingAuditContext ? new OriginatingAuditContext(props.originatingAuditContext) : null
    }));
  }
}
export default HelpdeskTicketSplitUpdateMessage;