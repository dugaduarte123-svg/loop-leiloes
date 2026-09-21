import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
import { getAPIEnableWidgetCookieBanner as getEnableWidgetCookieBannerOperator } from '../operators/getAPIEnableWidgetCookieBanner';
import { ON_WIDGET_LOAD } from 'conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes';
import { parseStringBoolean } from '../../utils/parseStringBoolean';
export const getAPIEnableWidgetCookieBanner = createSelector([getWidgetUiState], widgetUiState => getEnableWidgetCookieBannerOperator(widgetUiState) === ON_WIDGET_LOAD || parseStringBoolean(getEnableWidgetCookieBannerOperator(widgetUiState)));