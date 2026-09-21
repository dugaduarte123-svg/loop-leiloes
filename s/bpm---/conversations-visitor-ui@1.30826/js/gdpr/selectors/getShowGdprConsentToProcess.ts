import { createSelector } from '@reduxjs/toolkit';

// @ts-ignore Untyped import
import { gdprConsentToProcessEnabled } from 'conversations-internal-schema/widget-data/operators/gdprConsentToProcessEnabled';
// @ts-ignore Untyped import
import { gdprExplicitConsentRequired } from 'conversations-internal-schema/widget-data/operators/gdprExplicitConsentRequired';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getUserHasGivenConsentToProcess } from './getHasUserGivenConsentToProcess';
export const getShowGdprConsentToProcess = createSelector([getLatestWidgetData, getUserHasGivenConsentToProcess], (widgetData, userHasGivenConsentToProcess) => {
  return gdprConsentToProcessEnabled(widgetData) && !userHasGivenConsentToProcess && gdprExplicitConsentRequired(widgetData);
});