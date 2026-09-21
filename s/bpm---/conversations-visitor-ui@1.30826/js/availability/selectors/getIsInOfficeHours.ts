import { createSelector } from '@reduxjs/toolkit';
import { getOfficeHoursStartTime } from 'conversations-internal-schema/availability/operators/availabilityGetters';
import { getWidgetAvailabilityOptions } from './getWidgetAvailabilityOptions';
import { getAwayMessage } from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
export const getIsInOfficeHours = createSelector([getWidgetAvailabilityOptions], availabilityOptions => !getOfficeHoursStartTime(availabilityOptions) && !getAwayMessage(availabilityOptions));