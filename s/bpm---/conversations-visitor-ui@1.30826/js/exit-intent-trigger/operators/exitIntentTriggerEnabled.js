'use es6';

import {
    getMessage
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import {
    getClientTriggers
} from 'conversations-internal-schema/message/operators/messageGetters';
import {
    getDisplayOnExitIntent
} from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import {
    getEnabled
} from 'conversations-internal-schema/client-triggers/operators/exitIntentTriggerGetters';
export const exitIntentTriggerEnabled = widgetData => {
    const message = getMessage(widgetData);
    const clientTriggers = getClientTriggers(message);
    const displayOnExitIntent = getDisplayOnExitIntent(clientTriggers);
    const enabled = getEnabled(displayOnExitIntent);
    return enabled;
};