'use es6';

import {
    List
} from 'immutable';
import {
    getSendFrom
} from './widgetDataGetters';
const MAX_POTENTIAL_RESPONDERS = 3;
export const buildSendFromResponders = widgetData => {
    const sendFrom = getSendFrom(widgetData);
    const hasSendFromResponders = sendFrom && sendFrom.size > 0;
    if (hasSendFromResponders) {
        return sendFrom.take(MAX_POTENTIAL_RESPONDERS);
    }
    return List();
};