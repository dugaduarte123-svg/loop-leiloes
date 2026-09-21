import { createSelector } from '@reduxjs/toolkit';
import { getEnableScreenCapture } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getIsScreenCaptureEnabled = createSelector([getLatestWidgetData], latestWidgetData => !!getEnableScreenCapture(latestWidgetData));