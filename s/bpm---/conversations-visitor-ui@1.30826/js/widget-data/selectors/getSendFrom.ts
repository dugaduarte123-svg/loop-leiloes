import { getLatestWidgetData } from './getLatestWidgetData';
import { createSelector } from '@reduxjs/toolkit';
import { getSendFrom as getSendFromOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
export const getSendFrom = createSelector([getLatestWidgetData], state => getSendFromOperator(state));