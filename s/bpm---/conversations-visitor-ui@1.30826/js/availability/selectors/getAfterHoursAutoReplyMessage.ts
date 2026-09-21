import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
import { getWidgetAvailabilityOptions } from './getWidgetAvailabilityOptions';
export const getAfterHoursAutoReplyMessage = createSelector([getWidgetAvailabilityOptions], availabilityOptions => get('afterHoursAutoReplyMessage', availabilityOptions) || '');