import { createSelector } from '@reduxjs/toolkit';
import { getShowPreviousConversations as getShowPreviousConversationsOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from './getLatestWidgetData';
export const getShowPreviousConversations = createSelector([getLatestWidgetData], widgetData => {
  return getShowPreviousConversationsOperator(widgetData);
});