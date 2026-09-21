'use es6';

import {
    SYSTEM
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import TypicalResponseTimeMessage from 'conversations-message-history/typical-response-time/records/TypicalResponseTimeMessage';
import {
    getAvailabilityTypicalResponseTimeMessage
} from '../../availability/selectors/getAvailabilityTypicalResponseTimeMessage';
import {
    publishMessageToConversation
} from '../../actions/PublishActions/publishMessageToConversation';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    generateUuid
} from 'conversations-message-history/util/generateUuid';
import {
    SENT
} from 'conversations-message-history/common-message-format/constants/statusTypes';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import {
    buildHubSpotSystemSender
} from 'conversations-message-history/common-message-format/operators/buildHubSpotSystemSender';
import {
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
import {
    buildContactRecipients
} from 'conversations-message-history/common-message-format/operators/buildCommonMessageRecipients';
export const publishTypicalResponseTimeMessage = ({
    channel,
    threadId
}) => (dispatch, getState) => {
    const senderType = SYSTEM;
    const message = new TypicalResponseTimeMessage({
        id: generateUuid(),
        text: getAvailabilityTypicalResponseTimeMessage(getState()),
        sender: {
            '@type': senderType
        },
        status: {
            messageStatus: SENT
        },
        genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
        channelInstanceId: getChannelInstanceId(getState()),
        senders: buildHubSpotSystemSender(),
        recipients: buildContactRecipients({
            value: getMessagesUtk()
        })
    });
    dispatch(publishMessageToConversation({
        channel,
        message,
        threadId
    }));
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
        action: 'view reply time'
    }));
};