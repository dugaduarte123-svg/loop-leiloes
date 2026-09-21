import { fromJS, List } from 'immutable';
import reduce from 'transmute/reduce';
import Status from '../../common-message-format/records/Status';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { ATTACHMENT_TYPE_ID, MENTIONS, FILES } from '../constants/attachmentTypes';
import CommentMessage from '../records/CommentMessage';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
export const buildCommentMessage = (attrsArg = {}) => {
  const attrs = attrsArg || {};
  const status = Status(attrs.status);
  const {
    attachments = [],
    senders = []
  } = attrs;
  const attachmentsList = reduce(List(), (attachmentList, attachment) => {
    const attachmentType = attachment[ATTACHMENT_TYPE_ID];
    return attachmentType === MENTIONS || attachmentType === FILES ? attachmentList.push(fromJS(attachment)) : attachmentList;
  }, attachments);
  const id = attrs.id || generateUuid();
  const timestamp = attrs.timestamp || generateUniqueClientTimestamp('buildCommentMessage-timestamp');
  const sendersList = buildSenders(senders);
  const baseCommentMessage = CommentMessage(fromJS(attrs));
  return baseCommentMessage.merge({
    senders: sendersList,
    timestamp,
    attachments: attachmentsList,
    status,
    id
  });
};