import { Record as ImmutableRecord } from 'immutable';
import ChannelDetails from '../../channel-details/records/ChannelDetails';
const Thread = ImmutableRecord({
  assignedAgentId: null,
  channelDetails: ChannelDetails(),
  currentUrl: null,
  latestMessageTimestamp: 0,
  latestReadTimestamp: 0,
  responder: null,
  originalGenericChannelId: null,
  status: null,
  threadId: null,
  unseenCount: 0,
  hasFileAttachment: false,
  previewText: null,
  previewMessageId: null,
  hasChannelSwitchedToEmail: false
}, 'Thread');
export default Thread;