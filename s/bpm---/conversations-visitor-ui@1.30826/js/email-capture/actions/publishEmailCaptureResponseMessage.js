'use es6';

import EmailCaptureResponseMessage from 'conversations-message-history/email-capture-response/records/EmailCaptureResponseMessage';
import {
    publishMessageToConversation
} from '../../actions/PublishActions/publishMessageToConversation';
import {
    SYSTEM_SENDER
} from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import {
    generateUuid
} from 'conversations-message-history/util/generateUuid';
import {
    SENT
} from 'conversations-message-history/common-message-format/constants/statusTypes';
import {
    List as ImmutableList
} from 'immutable';
import {
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import {
    INCOMING
} from 'conversations-message-history/common-message-format/constants/messageDirections';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
import {
    buildSenders
} from 'conversations-message-history/common-message-format/operators/buildSenders';
import {
    CHANNEL_SPECIFIC_OPAQUE_ID
} from 'conversations-message-history/common-message-format/constants/deliveryIdentifierTypes';
const publishEmailCaptureResponseMessage = ({
    channel,
    email,
    threadId
}) => (dispatch, getState) => {
    const senderType = SYSTEM_SENDER;
    const deliveryIdentifier = {
        type: CHANNEL_SPECIFIC_OPAQUE_ID,
        value: getMessagesUtk() || ''
    };
    const visitorEmailCaptureResponseSender = ImmutableList([{
        deliveryIdentifier
    }]);
    const message = new EmailCaptureResponseMessage({
        id: generateUuid(),
        text: email,
        sender: {
            '@type': senderType
        },
        status: {
            messageStatus: SENT
        },
        channelInstanceId: getChannelInstanceId(getState()),
        senders: buildSenders(visitorEmailCaptureResponseSender),
        genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
        direction: INCOMING
    });
    dispatch(publishMessageToConversation({
        channel,
        message,
        threadId
    }));
};
export {
    publishEmailCaptureResponseMessage as
    default, publishEmailCaptureResponseMessage
};