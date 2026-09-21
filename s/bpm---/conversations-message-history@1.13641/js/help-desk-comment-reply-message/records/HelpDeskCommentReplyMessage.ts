import { Record, fromJS, Map as ImmutableMap, List } from 'immutable';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { generateUuid } from '../../util/generateUuid';
import { HELP_DESK_COMMENT_REPLY_SYSTEM_MESSAGE } from '../constants/messageTypes';
class HelpDeskCommentReplyMessage extends Record({
  '@type': HELP_DESK_COMMENT_REPLY_SYSTEM_MESSAGE,
  id: null,
  timestamp: null,
  senders: List(),
  messageDeletedStatus: NOT_DELETED,
  noteCreatedByAgentIdAndType: ImmutableMap({
    agentId: null,
    agentType: null
  }),
  noteCreatedByActorId: null,
  commentCreatedByAgentIdAndType: ImmutableMap({
    agentId: null,
    agentType: null
  }),
  commentCreatedByActorId: null,
  commentCreatedAtTimestamp: null,
  clientType: null,
  commentId: null,
  ablyTs: null,
  noteId: null,
  isMultipleSenders: false
}, 'HelpDeskCommentReplyMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('HelpDeskCommentReplyMessage-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }
}
export default HelpDeskCommentReplyMessage;