'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getAvailabilityAwayMessage
} from '../../availability/selectors/getAvailabilityAwayMessage';
import {
    getInitialMessageText
} from '../../selectors/widgetDataSelectors/getInitialMessageText';
import {
    getIsBotInAwayMode
} from '../../availability/selectors/getIsBotInAwayMode';
import {
    getAvailabilityOfficeHoursWillReturnMessage
} from '../../availability/selectors/getAvailabilityOfficeHoursWillReturnMessage';
import {
    getAllowVisitorOfflineMessaging
} from '../../availability/selectors/getAllowVisitorOfflineMessaging';
export const getFirstMessageText = createSelector([getAvailabilityAwayMessage, getInitialMessageText, getIsBotInAwayMode, getAvailabilityOfficeHoursWillReturnMessage, getAllowVisitorOfflineMessaging], (awayMessage, initialMessageText, isBotInAwayMode, availabilityOfficeHoursWillReturnMessage, isOfflineMessagingEnabled) => {
    if (isBotInAwayMode && !isOfflineMessagingEnabled) {
        return awayMessage || availabilityOfficeHoursWillReturnMessage;
    }
    return awayMessage || initialMessageText;
});