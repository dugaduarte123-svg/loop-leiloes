import { createSelector } from '@reduxjs/toolkit';
import { KNOWLEDGE_BASE, THREAD_LIST } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import { getKnowledgeBaseEnabled } from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { getCurrentView } from '../../current-view/selectors/getCurrentView';
export const getKBNavigationEnabled = createSelector([getCurrentView, getKnowledgeBaseEnabled], (currentView, kbEnabled) => {
  const isBaseNavigationView = currentView === KNOWLEDGE_BASE || currentView === THREAD_LIST;
  return kbEnabled && isBaseNavigationView;
});