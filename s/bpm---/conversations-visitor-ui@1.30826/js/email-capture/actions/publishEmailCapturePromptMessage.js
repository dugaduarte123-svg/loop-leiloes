'use es6';

import EmailCapturePromptMessage from 'conversations-message-history/email-capture-prompt/records/EmailCapturePromptMessage';
import {
    publishMessageToConversation
} from '../../actions/PublishActions/publishMessageToConversation';
import {
    getAskForEmailMessage
} from '../../selectors/widgetDataSelectors/getAskForEmailMessage';
import {
    getHasVisitorEmail
} from '../../selectors/widgetDataSelectors/getHasVisitorEmail';
import {
    canSendNewEmailCapturePromptMessage
} from '../../thread-histories/operators/canSendNewEmailCapturePromptMessage';
import {
    historyDataForThread
} from '../../thread-histories/selectors/historyDataForThread';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    EVENT_NAMES
} from '../../usage-tracking/constants/eventNames';
import {
    getAssignedResponderInWidget
} from '../../responders/selectors/getAssignedResponderInWidget';
import {
    getAgentType
} from 'conversations-internal-schema/responders/operators/getAgentType';
import {
    BOT
} from 'conversations-internal-schema/responders/constants/agentTypes';
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
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import {
    buildHubSpotSystemSender
} from 'conversations-message-history/common-message-format/operators/buildHubSpotSystemSender';
import {
    OUTGOING
} from 'conversations-message-history/common-message-format/constants/messageDirections';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import {
    buildContactRecipients
} from 'conversations-message-history/common-message-format/operators/buildCommonMessageRecipients';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
const publishEmailCapturePromptMessage = ({
    channel,
    threadId
}) => (dispatch, getState) => {
    const thread = getThreadByThreadId(getState(), {
        threadId
    });
    const threadHistory = historyDataForThread(getState(), {
        thread
    });
    const responderIsBot = getAgentType(getAssignedResponderInWidget(getState())) === BOT;
    if (!canSendNewEmailCapturePromptMessage(threadHistory) || getHasVisitorEmail(getState()) || responderIsBot) {
        return;
    }
    const senderType = SYSTEM_SENDER;
    const message = new EmailCapturePromptMessage({
        id: generateUuid(),
        text: getAskForEmailMessage(getState()),
        sender: {
            '@type': senderType
        },
        status: {
            messageStatus: SENT
        },
        channelInstanceId: getChannelInstanceId(getState()),
        senders: buildHubSpotSystemSender(),
        direction: OUTGOING,
        genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
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
        action: 'view email capture'
    }));
};
export {
    publishEmailCapturePromptMessage as
    default, publishEmailCapturePromptMessage
};