import { createSelector } from '@reduxjs/toolkit';
import get from 'transmute/get';
import { getWelcomeMessage } from './getWelcomeMessage';
export const getKnowledgeBaseEnabled = createSelector(getWelcomeMessage, get('knowledgeBaseEnabled'));