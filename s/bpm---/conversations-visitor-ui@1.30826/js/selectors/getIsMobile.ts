import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from './getWidgetUiState';
export const getIsMobile = createSelector([getWidgetUiState], widgetUiState => widgetUiState.mobile || widgetUiState.isFullscreen);