import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import get from 'transmute/get';
export const getIsAIChatbot = createSelector(getLatestWidgetData, widgetData => get('routingRuleDefinitionAI', widgetData) || false);