import { createSelector } from '@reduxjs/toolkit';
import { getKBEnabled } from '../operators/getKBEnabled';
import { getWelcomeMessage } from '../../selectors/widgetDataSelectors/getWelcomeMessage';
export const getKnowledgeBaseEnabled = createSelector([getWelcomeMessage], message => getKBEnabled(message));