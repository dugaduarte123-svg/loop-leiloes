'use es6';

import {
    hasBotMessages
} from 'conversations-message-history/thread-history/operators/hasBotMessages';
import {
    hasTypicalResponseTimeMessageFromCurrentSession
} from './hasTypicalResponseTimeMessageFromCurrentSession';
import {
    enoughTimeHasPassedForNewAutomatedChatMessage
} from './enoughTimeHasPassedForNewAutomatedChatMessage';
export const canSendNewTypicalResponseTimeMessage = thread => !hasBotMessages(thread) && (!hasTypicalResponseTimeMessageFromCurrentSession(thread) || enoughTimeHasPassedForNewAutomatedChatMessage(thread));