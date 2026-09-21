'use es6';

import {
    List as ImmutableList
} from 'immutable';
import {
    VISITOR
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import QuickReplyAttachment from 'conversations-message-history/common-message-format/records/QuickReplyAttachment';
import {
    getSenderKeyFromType
} from 'conversations-message-history/common-message-format/operators/getSenderKeyFromType';
import {
    toCmfSender
} from 'conversations-message-history/common-message-format/operators/cmfSenderInterop';
import {
    generateUuid
} from 'conversations-message-history/util/generateUuid';
import {
    SENT
} from 'conversations-message-history/common-message-format/constants/statusTypes';
import {
    buildCommonMessage
} from 'conversations-message-history/common-message-format/operators/buildCommonMessage';
import {
    buildCMFSender
} from 'conversations-message-history/common-message-format/operators/buildCMFSender';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from 'conversations-message-history/common-message-format/constants/genericChannelIds';
import {
    INCOMING
} from 'conversations-message-history/common-message-format/constants/messageDirections';
import {
    CHANNEL_SPECIFIC_OPAQUE_ID
} from 'conversations-message-history/common-message-format/constants/deliveryIdentifierTypes';
export const buildVisitorCommonMessage = ({
    channelInstanceId,
    clientType,
    fileAttachment,
    quickReply,
    richText,
    senderId,
    text
}) => {
    const cmfSenderType = toCmfSender(VISITOR);
    const senderTypeKey = getSenderKeyFromType(cmfSenderType);
    const attachments = [];
    const deliveryIdentifier = {
        type: CHANNEL_SPECIFIC_OPAQUE_ID,
        value: senderId
    };
    const visitorSender = buildCMFSender({
        deliveryIdentifier
    });
    const senders = ImmutableList([visitorSender]);
    if (fileAttachment) {
        attachments.push(fileAttachment);
    }
    if (quickReply) {
        attachments.push(new QuickReplyAttachment(quickReply));
    }
    const message = buildCommonMessage({
        status: {
            messageStatus: SENT
        },
        clientType,
        attachments,
        text,
        richText,
        id: generateUuid(),
        sender: {
            '@type': cmfSenderType,
            [senderTypeKey]: senderId
        },
        senders,
        channelInstanceId,
        genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
        direction: INCOMING
    });
    return message;
};