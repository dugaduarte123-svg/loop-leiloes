import { fromJS, List } from 'immutable';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import EngagementDetailsRecord from '../records/EngagementDetailsRecord';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
export const buildEngagementDetailsMessage = attrs => {
  const {
    attachments = [],
    senders = []
  } = attrs;
  const attachmentsList = attachments.reduce((attachmentList, attachment) => {
    return attachmentList.push(fromJS(attachment));
  }, List());
  const id = attrs.id || generateUuid();
  const timestamp = attrs.timestamp || generateUniqueClientTimestamp('buildEngagementMessage-timestamp');
  const sendersList = buildSenders(senders);
  const baseEngagementMessage = EngagementDetailsRecord(fromJS(attrs));
  const isAsync = Boolean('isAsync' in attrs ? attrs.isAsync : false);
  return baseEngagementMessage.merge({
    senders: sendersList,
    timestamp,
    attachments: attachmentsList,
    id,
    isAsync
  });
};