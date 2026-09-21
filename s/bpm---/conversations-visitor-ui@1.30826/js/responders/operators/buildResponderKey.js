'use es6';

import {
    agentTypeToSenderType
} from 'conversations-message-history/senders/operators/agentTypeToSenderType';
import {
    AGENT,
    BOT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    getAgentType,
    getIsBot,
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    Map as ImmutableMap
} from 'immutable';
import invariant from 'react-utils/invariant';
export const buildResponderKey = ({
    senderId,
    senderType
}) => {
    invariant(senderId && senderType, 'Responder keys must be set with valid ID and type. Received %s, %s', senderId, senderType);
    return ImmutableMap({
        senderId: String(senderId),
        senderType
    });
};
export const buildResponderKeyFromResponder = responder => {
    const senderId = getUserId(responder);
    const agentType = getAgentType(responder);
    const senderType = agentType ? agentTypeToSenderType(agentType) : getIsBot(responder) ? BOT : AGENT;
    return buildResponderKey({
        senderId,
        senderType
    });
};
export const buildResponderKeyFromRequest = requestArgs => {
    const {
        senderId,
        agentType
    } = requestArgs;
    const senderType = agentTypeToSenderType(agentType);
    return buildResponderKey({
        senderId,
        senderType
    });
};