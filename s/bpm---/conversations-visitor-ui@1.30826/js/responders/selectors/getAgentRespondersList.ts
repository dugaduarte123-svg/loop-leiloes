import { createSelector } from '@reduxjs/toolkit';
// @ts-ignore Untyped import
import { getAllAgentResponders } from './getAllAgentResponders';
export const getAgentRespondersList = createSelector([getAllAgentResponders], agentRespondersMap => agentRespondersMap.toList());