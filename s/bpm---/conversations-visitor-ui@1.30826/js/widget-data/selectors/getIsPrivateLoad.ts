import { createSelector } from '@reduxjs/toolkit';
import { getIsPrivateLoad as getIsPrivateLoadOperator } from '../operators/getIsPrivateLoad';
import { getLatestWidgetData } from './getLatestWidgetData';
export const getIsPrivateLoad = createSelector(getLatestWidgetData, widgetData => getIsPrivateLoadOperator(widgetData));