import { createSelector } from '@reduxjs/toolkit';
import { getData } from '../../constants/asyncStatuses';
import { getWidgetDataAsyncData } from './getWidgetDataAsyncData';
export const getLatestWidgetData = createSelector(getWidgetDataAsyncData, widgetDataAsyncData => getData(widgetDataAsyncData));