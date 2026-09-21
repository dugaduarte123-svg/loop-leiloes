'use es6';

import {
    List,
    Record
} from 'immutable';
import {
    INITIAL_MESSAGE
} from '../constants/messageType';
import {
    OUTGOING
} from '../../common-message-format/constants/messageDirections';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from '../../common-message-format/constants/genericChannelIds';
const InitialMessage = Record({
    '@type': INITIAL_MESSAGE,
    clientType: null,
    id: null,
    richText: null,
    sender: null,
    status: null,
    text: null,
    timestamp: null,
    attachments: List(),
    direction: OUTGOING,
    channelInstanceId: null,
    genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
    senders: List(),
    recipients: List()
}, 'InitialMessage');
export default InitialMessage;