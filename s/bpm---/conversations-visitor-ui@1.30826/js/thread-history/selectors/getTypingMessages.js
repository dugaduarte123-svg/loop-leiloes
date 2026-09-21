'use es6';

import {
    agentTypeToCMFSenderType
} from 'conversations-message-history/senders/operators/agentTypeToSenderType';
import {
    getAgentType,
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getTypingResponderFromCurrentThread
} from '../../typing-indicators/selectors/getTypingResponderFromCurrentThread';
import {
    getCurrentThreadId
} from './getCurrentThreadId';
import {
    List as ImmutableList
} from 'immutable';
import TypingIndicatorMessage from 'conversations-message-history/typing-indicator/records/TypingIndicatorMessage';
import {
    generateUuid
} from 'conversations-message-history/util/generateUuid';
import {
    getSenderKeyFromType
} from 'conversations-message-history/common-message-format/operators/getSenderKeyFromType';
export const getTypingMessages = createSelector([getTypingResponderFromCurrentThread, getCurrentThreadId], (typingResponder, threadId) => {
    if (!typingResponder || !threadId) {
        return ImmutableList();
    }
    const senderType = agentTypeToCMFSenderType(getAgentType(typingResponder), true);
    const senderTypeKey = getSenderKeyFromType(senderType);
    return ImmutableList([new TypingIndicatorMessage({
        id: generateUuid(),
        typingState: null,
        sender: {
            '@type': senderType,
            [senderTypeKey]: getUserId(typingResponder)
        }
    })]);
});