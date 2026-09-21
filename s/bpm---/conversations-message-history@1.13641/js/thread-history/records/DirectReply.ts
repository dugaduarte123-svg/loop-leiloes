import get from 'transmute/get';
import { List, Record } from 'immutable';
// @ts-ignore module not typed
import { buildAttachments } from '../../common-message-format/operators/buildAttachments';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
import { ACCEPTED_ATTACHMENT_TYPES } from '../constants/directReply';
const defaultProps = {
  attachments: List(),
  genericChannelId: null,
  messageStatus: null,
  messageTimestamp: null,
  senders: List(),
  truncatedText: '',
  id: null,
  timestamp: null
};
const DirectReply = Record(defaultProps, 'DirectReply');
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  if (!props) return DirectReply();
  return DirectReply(Object.assign({}, defaultProps, {
    attachments: buildAttachments(props.attachments, ACCEPTED_ATTACHMENT_TYPES),
    genericChannelId: get('genericChannelId', props),
    messageStatus: get('messageStatus', props),
    messageTimestamp: get('messageTimestamp', props),
    senders: buildSenders(props.senders),
    truncatedText: get('truncatedText', props)
  }));
}