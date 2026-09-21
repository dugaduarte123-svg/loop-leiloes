'use es6';

import {
    isChatMessage
} from '../../common-message-format/operators/cmfComparators';
import {
    isFromAgent
} from '../../common-message-format/operators/senderTypeComparators';
import {
    getMessages
} from './getMessages';
export const hasChatMessageFromAgent = threadHistory => {
    const messages = getMessages(threadHistory);
    return messages.some(message => isChatMessage(message) && isFromAgent(message));
};