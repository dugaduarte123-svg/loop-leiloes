import { createSelector } from '@reduxjs/toolkit';
import { getUseSpotlightLauncher } from '../../widget-data/selectors/widgetDataSelectors';
import { FADE, SCALE_FOLD } from '../constants/constants';
export const getCurrentAnimation = createSelector([getUseSpotlightLauncher], useSpotlight => useSpotlight ? SCALE_FOLD : FADE);