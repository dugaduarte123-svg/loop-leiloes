import { createSelector } from '@reduxjs/toolkit';
import { getKBRecommendationType } from '../operators/getKBRecommendationType';
import { getWelcomeMessage } from '../../selectors/widgetDataSelectors/getWelcomeMessage';
export const getKnowledgeBaseRecommendationType = createSelector([getWelcomeMessage], message => getKBRecommendationType(message));