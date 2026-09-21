import { createSelector } from 'reselect';
import { getFont } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from './getLatestWidgetData';
export const getWidgetFont = createSelector(getLatestWidgetData, widgetData => getFont(widgetData));