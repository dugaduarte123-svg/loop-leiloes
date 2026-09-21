import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from './getWidgetUiState';
export const getUserInteractedWithWidget = createSelector([getWidgetUiState], widgetUiState => widgetUiState.userInteractedWithWidget);