'use es6';

import get from 'transmute/get';
import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getPopOpenWelcomeMessage
} from '../../selectors/widgetDataSelectors/getPopOpenWelcomeMessage';
import {
    getIsBot
} from '../../selectors/widgetDataSelectors/getIsBot';
import {
    getHasCustomFont
} from '../../selectors/widgetDataSelectors/getHasCustomFont';
import {
    getUrlForMessage
} from '../../utils/getUrlForMessage';
import {
    widgetState
} from './widgetState';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getVisitorIdentificationEnabled
} from '../../visitor-identity/operators/getVisitorIdentificationEnabled';
import {
    getFeedbackSurveyEnabled
} from '../../feedback-survey/feedbackSurveyEnabledSlice';
import {
    getKnowledgeBaseEnabled
} from '../../widget-data/selectors/getKnowledgeBaseEnabled';
import {
    getIsAIChatbot
} from '../../selectors/widgetDataSelectors/getIsAIChatbot';
import {
    getIsMobile
} from '../../selectors/getIsMobile';
import {
    getWidgetLocation
} from '../../selectors/widgetDataSelectors/getWidgetLocation';
import {
    getRecommendedQuestionsForAgent
} from '../../widget-data/selectors/getRecommendedQuestionsForAgent';
import {
    getWidgetSizeEventProps
} from '../../widget-size/widgetSizeSelectors';
import {
    getLauncherType
} from '../../widget-data/selectors/widgetDataSelectors';
export const eventProps = createSelector([widgetState, getIsBot, getPopOpenWelcomeMessage, getLatestWidgetData, getKnowledgeBaseEnabled, getVisitorIdentificationEnabled, getFeedbackSurveyEnabled, getHasCustomFont, getIsAIChatbot, getIsMobile, getWidgetLocation, getRecommendedQuestionsForAgent, getWidgetSizeEventProps, getLauncherType], (state, botEnabled, promptEnabled, widgetData, knowledgeBaseEnabled, visitorIdentificationEnabled, feedbackSurveyEnabled, hasCustomFont, isAIChatBot, mobile, widgetLocation, recommendedQuestionsForAgent, widgetSizeEventProps, launcherType) => {
    const hasRecommendedQuestionsForAgent = Boolean((recommendedQuestionsForAgent === null || recommendedQuestionsForAgent === void 0 ? void 0 : recommendedQuestionsForAgent.length) > 0);
    return Object.assign({
        state,
        botEnabled,
        promptEnabled,
        path: getUrlForMessage(),
        chatflowId: get('chatflowId', widgetData),
        knowledgeBaseEnabled,
        visitorIdentificationEnabled,
        feedbackSurveyEnabled,
        hasCustomFont,
        isAIChatBot,
        mobile,
        widgetLocation,
        hasRecommendedQuestionsForAgent,
        launcherType
    }, widgetSizeEventProps);
});