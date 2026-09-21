'use es6';

import getIn from 'transmute/getIn';
export const getTypingTimeoutIdForAgentInThread = ({
    threadId,
    senderId,
    typingStates
}) => getIn([threadId, senderId], typingStates);