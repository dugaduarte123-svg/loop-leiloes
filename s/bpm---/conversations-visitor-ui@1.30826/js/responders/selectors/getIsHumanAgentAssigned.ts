import { createSelector } from '@reduxjs/toolkit';
import { getAssignedResponderInWidget } from './getAssignedResponderInWidget';
import { getWidgetBotResponder } from '../../selectors/widgetDataSelectors/getWidgetBotResponder';
export const getIsHumanAgentAssigned = createSelector([getAssignedResponderInWidget, getWidgetBotResponder], (assignedResponder, botResponder) => assignedResponder !== null && assignedResponder !== botResponder);