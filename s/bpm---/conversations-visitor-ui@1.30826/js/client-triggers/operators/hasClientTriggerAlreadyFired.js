'use es6';

import {
    getMessage
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import {
    getClientTriggers,
    getPopMessageOnSmallScreens,
    getPopOpenWelcomeMessage,
    getPopOpenWidget
} from 'conversations-internal-schema/message/operators/messageGetters';
import {
    getDisplayOnTimeDelay
} from 'conversations-internal-schema/client-triggers/operators/clientTriggersGetters';
import {
    getEnabled
} from 'conversations-internal-schema/client-triggers/operators/scrollPercentageTriggerGetters';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getIsMobile
} from '../../selectors/getIsMobile';
export const hasClientTriggerAlreadyFired = state => {
    const widgetData = getLatestWidgetData(state);
    const message = getMessage(widgetData);
    const clientTriggers = getClientTriggers(message);
    const displayOnTimeDelay = getDisplayOnTimeDelay(clientTriggers);
    const mobile = getIsMobile(state);

    // check if the time on page trigger is enabled
    const enabled = getEnabled(displayOnTimeDelay);

    // if the time on page is enabled and it hid the iframe, then it must have
    // been triggered in the embed script in getDelayLoadingWidgetIframe.js
    const popMessageOnSmallScreens = getPopMessageOnSmallScreens(message);
    const popOpenWelcomeMessage = getPopOpenWelcomeMessage(message);
    const popOpenWidget = getPopOpenWidget(message);
    if (mobile) {
        return enabled && !popMessageOnSmallScreens;
    }
    return !popOpenWidget && !popOpenWelcomeMessage && enabled;
};