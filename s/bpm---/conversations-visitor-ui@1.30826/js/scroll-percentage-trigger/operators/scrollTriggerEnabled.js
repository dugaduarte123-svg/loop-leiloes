'use es6';

import {
    getMessage
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import {
    getClientTriggers
} from 'conversations-internal-schema/message/operators/messageGetters';
import {
    getDisplayOnScrollPercentage
} from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import {
    getEnabled
} from 'conversations-internal-schema/client-triggers/operators/scrollPercentageTriggerGetters';
export const scrollTriggerEnabled = widgetData => {
    const message = getMessage(widgetData);
    const clientTriggers = getClientTriggers(message);
    const displayOnScrollPercentage = getDisplayOnScrollPercentage(clientTriggers);
    const enabled = getEnabled(displayOnScrollPercentage);
    return enabled;
};