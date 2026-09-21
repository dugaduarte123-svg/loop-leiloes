import _objectDestructuringEmpty from "@babel/runtime/helpers/esm/objectDestructuringEmpty";
import { Map as ImmutableMap } from 'immutable';
// @ts-ignore module not typed
import { buildAttachments } from '../../common-message-format/operators/buildAttachments';
import { buildRecipients } from '../../common-message-format/operators/buildRecipients';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
// @ts-ignore module not typed
import { buildStatus } from '../../common-message-format/operators/buildStatus';
import FeedbackSubmissionMessage from '../records/FeedbackSubmissionMessage';
/**
 * Builds a FeedbackSubmissionMessage from a pojo
 *
 * As compared to constructing directly with the FeedbackSubmissionMessage, this will convert necessary fields to their Immutable counterparts
 */
export const buildFeedbackSubmissionMessage = (_ref = {}) => {
  let props = Object.assign({}, (_objectDestructuringEmpty(_ref), _ref));
  const attachments = buildAttachments(props.attachments);
  const recipients = buildRecipients(props.recipients);
  const sender = props.sender ? ImmutableMap(props.sender) // buildSender
  : ImmutableMap();
  const senders = buildSenders(props.senders);
  const status = buildStatus(props.status);
  return new FeedbackSubmissionMessage(Object.assign({}, props, {
    attachments,
    recipients,
    sender,
    senders,
    status
  }));
};