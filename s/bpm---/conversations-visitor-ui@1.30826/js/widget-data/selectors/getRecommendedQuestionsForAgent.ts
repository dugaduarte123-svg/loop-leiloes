import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from './getLatestWidgetData';
import { getRecommendedQuestionsForAgent as getRecommendedQuestionsGetter } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
export const getRecommendedQuestionsForAgent = createSelector(getLatestWidgetData, widgetData => getRecommendedQuestionsGetter(widgetData) || []);