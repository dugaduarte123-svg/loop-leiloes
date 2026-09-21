import { createSelector } from '@reduxjs/toolkit';
import { getColoring as getColoringOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getColoring = createSelector(getLatestWidgetData, getColoringOperator);