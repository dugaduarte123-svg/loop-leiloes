import { createSelector } from '@reduxjs/toolkit';

// @ts-ignore Untyped Dependency
import { getPopOpenWidget as getPopOpenWidgetOperator } from 'conversations-internal-schema/message/operators/messageGetters';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getPopOpenWidget = createSelector(getWelcomeMessage, (welcomeMessage = {}) => getPopOpenWidgetOperator(welcomeMessage));