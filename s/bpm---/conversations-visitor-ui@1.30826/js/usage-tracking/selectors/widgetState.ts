import { createSelector } from '@reduxjs/toolkit';
import { widgetIsInAwayMode as isWidgetInAwayMode } from '../../availability/selectors/widgetIsInAwayMode';
import { OFFLINE, ONLINE } from '../constants/widgetState';
export const widgetState = createSelector(isWidgetInAwayMode, widgetIsInAwayMode => widgetIsInAwayMode ? OFFLINE : ONLINE);