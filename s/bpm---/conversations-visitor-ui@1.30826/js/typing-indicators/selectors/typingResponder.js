'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import has from 'transmute/has';
import get from 'transmute/get';
import {
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    getWidgetBotResponder
} from '../../selectors/widgetDataSelectors/getWidgetBotResponder';
import {
    getAllAgentResponders
} from '../../responders/selectors/getAllAgentResponders';
import {
    typingTimeoutsForThreadInProps
} from './typingTimeoutsForThreadInProps';
export const typingResponder = createSelector([typingTimeoutsForThreadInProps, getAllAgentResponders, getWidgetBotResponder], (typingAgentTimeoutsMap, responders, botResponder) => {
    const botResponderUserId = getUserId(botResponder);
    if (get(botResponderUserId, typingAgentTimeoutsMap)) {
        return botResponder;
    }
    return responders && responders.find(responder => {
        const responderUserId = getUserId(responder);
        return has(responderUserId, typingAgentTimeoutsMap);
    });
});