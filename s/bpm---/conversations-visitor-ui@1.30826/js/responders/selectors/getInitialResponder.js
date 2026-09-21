'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getAssignedResponderInWidget
} from './getAssignedResponderInWidget';
import {
    getPotentialResponders
} from './getPotentialResponders';
import {
    getWidgetBotResponder
} from '../../selectors/widgetDataSelectors/getWidgetBotResponder';
export const getInitialResponder = createSelector([getAssignedResponderInWidget, getPotentialResponders, getWidgetBotResponder], (responder, responders, botResponder) => {
    if (botResponder) {
        return botResponder;
    }
    return responder || responders.get(0);
});