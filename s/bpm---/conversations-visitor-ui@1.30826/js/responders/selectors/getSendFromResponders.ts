import { createSelector } from '@reduxjs/toolkit';
// @ts-ignore Untyped import
import { buildSendFromResponders } from 'conversations-internal-schema/widget-data/operators/buildSendFromResponders';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export const getSendFromResponders = createSelector([getLatestWidgetData], widgetData => buildSendFromResponders(widgetData));