import { fromJS } from 'immutable';
import compose from 'transmute/compose';
import getIn from 'transmute/getIn';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import WorkflowGeneratedUserMessage from '../records/WorkflowGeneratedUserMessage';
import { STATUS } from '../../common-message-format/constants/keyPaths';
// @ts-ignore module not typed
import { buildAttachments } from '../../common-message-format/operators/buildAttachments';
// @ts-ignore module not typed
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import { getTimestamp
// @ts-ignore module not typed
} from '../../common-message-format/operators/commonMessageFormatGetters';
import { setAttachments, setId, setStatus, setTimestamp
// @ts-ignore module not typed
} from '../../common-message-format/operators/commonMessageFormatSetters';
import { setMessageDirection, setRecipients, setSenders } from '../../common-message-format/operators/commonMessageSetters';
import { buildRecipients } from '../../common-message-format/operators/buildRecipients';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
export const buildWorkflowGeneratedUserMessage = (props = {}) => {
  const status = buildStatus(getIn(STATUS, props));
  const attachments = buildAttachments(props.attachments);
  const recipients = buildRecipients(props.recipients);
  const senders = buildSenders(props.senders);
  const messageDirection = props.direction || '';
  const id = 'id' in props && props.id !== undefined && props.id !== '' ? props.id : generateUuid();
  const timestamp = getTimestamp(props) || generateUniqueClientTimestamp('buildWorkflowGeneratedUserMessage-timestamp');
  return compose(setId(id), setStatus(status), setAttachments(attachments), setTimestamp(timestamp), setRecipients(recipients), setSenders(senders), setMessageDirection(messageDirection))(WorkflowGeneratedUserMessage(fromJS(props)));
};