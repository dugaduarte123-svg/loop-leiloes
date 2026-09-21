import { createSelector } from '@reduxjs/toolkit';
import { widgetIsInAwayMode } from './widgetIsInAwayMode';
import { getIsInOfficeHours } from './getIsInOfficeHours';
export const getIsWidgetInAwayMode = createSelector([widgetIsInAwayMode, getIsInOfficeHours], (inAwayMode, isInOfficeHours) => Boolean(inAwayMode || !isInOfficeHours));