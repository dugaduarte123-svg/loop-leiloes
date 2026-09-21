'use es6';

import {
    getMessage
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import {
    getClientTriggers
} from 'conversations-internal-schema/message/operators/messageGetters';
import {
    getDisplayOnTimeDelay
} from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import {
    getEnabled
} from 'conversations-internal-schema/client-triggers/operators/scrollPercentageTriggerGetters';
export const timeOnPageTriggerEnabled = widgetData => {
    const message = getMessage(widgetData);
    const clientTriggers = getClientTriggers(message);
    const displayOnTimeDelay = getDisplayOnTimeDelay(clientTriggers);
    const enabled = getEnabled(displayOnTimeDelay);
    return enabled;
};