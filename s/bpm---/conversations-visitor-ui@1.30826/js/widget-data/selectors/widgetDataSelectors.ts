import { createSelector } from '@reduxjs/toolkit';
import { getWelcomeMessage } from '../../selectors/widgetDataSelectors/getWelcomeMessage';
import { getGates, getLanguage, getLauncherType as getLauncherTypeOperator, getSearchableKnowledgeBaseIds as getSearchableKnowledgeBaseIdsOperator } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getChatflowName as getChatflowNameOperator } from '../operators/widgetDataGetters';
import { getLatestWidgetData } from './getLatestWidgetData';
import { getIsAIChatbot } from '../../selectors/widgetDataSelectors/getIsAIChatbot';
import { DEFAULT, SPOTLIGHT } from 'conversations-internal-schema/widget-data/constants/launcherTypes';
import { getIsMobile } from '../../selectors/getIsMobile';
import get from 'transmute/get';
import { getUsePillLauncher as getUsePillLauncherOperator } from 'conversations-visitor-experience-components/visitor-widget/operators/getUsePillLauncher';
export const getWidgetDataLanguage = createSelector(getLatestWidgetData, widgetData => getLanguage(widgetData));
export const getSearchableKnowledgeBaseIds = createSelector(getWelcomeMessage, welcomeMessage => getSearchableKnowledgeBaseIdsOperator(welcomeMessage));
export const getWidgetDataGates = createSelector(getLatestWidgetData, widgetData => getGates(widgetData));
export const getChatflowName = createSelector(getLatestWidgetData, widgetData => getChatflowNameOperator(widgetData));

/* validates a single gate or multiple gates */
export const createGateSelectorFromGateNames = (...gateNames) => createSelector([getWidgetDataGates], gates => gateNames.every(key => (gates === null || gates === void 0 ? void 0 : gates[key]) === true || (gates === null || gates === void 0 ? void 0 : gates[key]) === 'true'));
export const getLauncherType = createSelector(getLatestWidgetData, widgetData => getLauncherTypeOperator(widgetData) || DEFAULT);
export const getIsUngatedForCloseThread = createGateSelectorFromGateNames('LiveChat:Threads:closeThread');
export const getIsClosingAgentSystemChatflow = createSelector(getLatestWidgetData, widgetData => get('systemChatflow', widgetData) === true);
export const getUsePillLauncher = createSelector([getIsAIChatbot, getIsClosingAgentSystemChatflow, getLauncherType, getIsMobile], (isAIChatbot, isClosingAgentSystemChatflow, launcherType, isMobile) => getUsePillLauncherOperator({
  isAIChatBot: isAIChatbot,
  isClosingAgentSystemChatflow,
  launcherType,
  mobile: isMobile
}));
export const getIsUngatedForInAppHelp = createGateSelectorFromGateNames('LiveChat:ConversationsVisitor:InAppHelp');
export const getIsUngatedForClosingAgentRefresh = createGateSelectorFromGateNames('commerce:cpq:ai:ClosingAgentRefresh');
export const getIsUngatedForCustomerAgentFeedback = createGateSelectorFromGateNames('CustomerAgent:FeedbackMessage');
export const getIsUngatedForDetachWidget = createGateSelectorFromGateNames('LiveChat:ConversationsVisitor:Detach');
export const getIsUngatedForSpotlightFormFactor = createGateSelectorFromGateNames('LiveChat:SpotlightFormFactor');
export const getIsUngatedForSpotlightGlow = createGateSelectorFromGateNames('LiveChat:SpotlightGlow');
export const getUseSpotlightLauncher = createSelector([getIsUngatedForSpotlightFormFactor, getLauncherType, getIsMobile], (isUngated, launcherType, isMobile) => isUngated && launcherType === SPOTLIGHT && !isMobile);