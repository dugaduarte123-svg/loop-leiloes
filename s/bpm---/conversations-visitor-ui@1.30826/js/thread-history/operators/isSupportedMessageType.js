'use es6';

import ActivelyPublishing from 'conversations-message-history/unpublished-messages/records/ActivelyPublishing';
import FailedToPublish from 'conversations-message-history/unpublished-messages/records/FailedToPublish';
import {
    getMessage
} from 'conversations-message-history/unpublished-messages/operators/getters';
import {
    isVisitorTypingMessage
} from '../../typing-indicators/operators/isVisitorTypingMessage';
import {
    getType,
    getSenderType
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    VISITOR
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    supportedMessageTypes
} from '../constants/supportedMessageTypes';
export const isSupportedMessageType = message => {
    if (message instanceof ActivelyPublishing || message instanceof FailedToPublish) {
        message = getMessage(message);
        if (getSenderType(message) !== VISITOR) {
            return false;
        }
    }
    if (isVisitorTypingMessage(message)) {
        return false;
    }
    const type = getType(message);
    return Object.keys(supportedMessageTypes).some(messageType => messageType === type);
};