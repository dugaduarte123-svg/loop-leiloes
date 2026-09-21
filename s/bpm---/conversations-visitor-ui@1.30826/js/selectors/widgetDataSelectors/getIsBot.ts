import { createSelector } from '@reduxjs/toolkit';
import { getBotResponder } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { isTypeBot } from 'conversations-internal-schema/responders/operators/isTypeBot';
export const getIsBot = createSelector(getLatestWidgetData, widgetData => isTypeBot(getBotResponder(widgetData)));