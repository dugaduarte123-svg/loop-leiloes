'use es6';

import * as senderTypes from '../../common-message-format/constants/legacySenderTypes';
import * as cmfSenderTypes from '../constants/cmfSenderTypes';
const cmfSenderToSenderMapping = {
    [cmfSenderTypes.AGENT_SENDER]: senderTypes.AGENT,
    [cmfSenderTypes.VISITOR_SENDER]: senderTypes.VISITOR,
    //VISITOR_SENDER is used when the message has a utk
    [cmfSenderTypes.BOT_SENDER]: senderTypes.BOT,
    [cmfSenderTypes.SYSTEM_SENDER]: senderTypes.SYSTEM,
    [cmfSenderTypes.INTEGRATOR_SENDER]: senderTypes.INTEGRATOR,
    [cmfSenderTypes.VID_SENDER]: senderTypes.VISITOR //VID_SENDER is used for email and FBMessengers that have vids
};
const senderToCmfSenderMapping = {
    [senderTypes.AGENT]: cmfSenderTypes.AGENT_SENDER,
    [senderTypes.VISITOR]: cmfSenderTypes.VISITOR_SENDER,
    [senderTypes.BOT]: cmfSenderTypes.BOT_SENDER,
    [senderTypes.SYSTEM]: cmfSenderTypes.SYSTEM_SENDER,
    [senderTypes.INTEGRATOR]: cmfSenderTypes.INTEGRATOR_SENDER
};

/**
 *
 * @param {string} cmfSenderType
 * @returns {string} senderType
 */
export function fromCmfSender(cmfSenderType) {
    return cmfSenderToSenderMapping[cmfSenderType];
}

/**
 *
 * @param {string} senderType
 * @returns {string} cmfSenderType
 */
export function toCmfSender(senderType) {
    return senderToCmfSenderMapping[senderType];
}