import { createSelector } from '@reduxjs/toolkit';
import { getWidgetUiState } from './getWidgetUiState';
export const getIsOpen = createSelector([getWidgetUiState], widgetUiState => widgetUiState.open);