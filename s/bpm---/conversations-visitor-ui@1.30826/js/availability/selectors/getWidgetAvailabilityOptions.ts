import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getAvailabilityOptions } from '../operators/getAvailabilityOptions';
export const getWidgetAvailabilityOptions = createSelector([getLatestWidgetData], getAvailabilityOptions);