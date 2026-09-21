'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    makeTypicalResponseTimeText
} from 'conversations-internal-schema/typical-response-time/operators/makeTypicalResponseTimeText';
import {
    getTypicalResponseTime
} from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
import {
    getWidgetAvailabilityOptions
} from './getWidgetAvailabilityOptions';
export const getAvailabilityTypicalResponseTimeMessage = createSelector(getWidgetAvailabilityOptions, availabilityOptions => {
    const typicalResponseTime = getTypicalResponseTime(availabilityOptions);
    if (!typicalResponseTime) {
        return '';
    }
    return makeTypicalResponseTimeText({
        typicalResponseTime
    });
});