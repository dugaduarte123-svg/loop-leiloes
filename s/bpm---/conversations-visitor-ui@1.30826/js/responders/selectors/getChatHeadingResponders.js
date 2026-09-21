'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    chatHeadingRespondersList
} from '../operators/chatHeadingRespondersList';
import {
    getChatHeadingConfig
} from '../../chat-heading-config/selectors/getChatHeadingConfig';
import {
    getAgentRespondersList
} from './getAgentRespondersList';
import {
    getAssignedResponderInWidget
} from './getAssignedResponderInWidget';
import {
    getSendFromResponders
} from './getSendFromResponders';
export const getChatHeadingResponders = createSelector([getAssignedResponderInWidget, getChatHeadingConfig, getAgentRespondersList, getSendFromResponders], (assignedResponder, chatHeadingConfig, responders, sendFromResponders) => chatHeadingRespondersList({
    assignedResponder,
    chatHeadingConfig,
    responders,
    sendFromResponders
}));