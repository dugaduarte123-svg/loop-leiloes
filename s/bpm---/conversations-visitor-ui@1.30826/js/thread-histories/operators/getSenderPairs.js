'use es6';

import {
    Set as ImmutableSet,
    Map as ImmutableMap
} from 'immutable';
import {
    AGENT,
    BOT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getMessages';
import {
    getSenderId,
    getSenderType
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    isCommonMessageFormat,
    isEmailCMF
} from 'conversations-message-history/common-message-format/operators/cmfComparators';
import {
    isInitialMessage
} from 'conversations-message-history/initial-message/operators/isInitialMessage';
export const getSenderPairs = threadHistory => {
    if (!threadHistory || !getMessages(threadHistory)) {
        return ImmutableSet();
    }
    return getMessages(threadHistory).reduce((responders, message) => {
        if (isCommonMessageFormat(message) && !isEmailCMF(message) || isInitialMessage(message)) {
            const senderId = getSenderId(message);
            const senderType = getSenderType(message);
            const responder = ImmutableMap({
                senderId,
                senderType
            });
            if (senderId && (senderType === AGENT || senderType === BOT)) {
                return responders.add(responder);
            }
        }
        return responders;
    }, ImmutableSet());
};