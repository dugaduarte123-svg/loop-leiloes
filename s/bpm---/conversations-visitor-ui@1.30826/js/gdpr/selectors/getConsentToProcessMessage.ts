import { createSelector } from '@reduxjs/toolkit';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getConsentToProcessMessage as getConsentToProcessMessageOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
export const getConsentToProcessMessage = createSelector([getLatestWidgetData], widgetData => getConsentToProcessMessageOperator(widgetData));