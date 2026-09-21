import { createSelector } from '@reduxjs/toolkit';
import { getAvailabilityAwayMessage } from './getAvailabilityAwayMessage';
export const widgetIsInAwayMode = createSelector([getAvailabilityAwayMessage], awayMessage => Boolean(awayMessage));