import { getKnowledgeBaseEnabled } from '../../widget-data/selectors/getKnowledgeBaseEnabled';
import { getCurrentView } from '../selectors/getCurrentView';
import { KNOWLEDGE_BASE, THREAD_LIST, CATEGORY_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import I18n from 'I18n';
import { createSelector } from '@reduxjs/toolkit';
import { getSelectedCategory } from '../../knowledge-base/selectors/kbLibrarySelectors';
export const getCustomHeaderText = createSelector([getKnowledgeBaseEnabled, getCurrentView, getSelectedCategory], (kbEnabled, currentView, selectedCategory) => {
  if (kbEnabled) {
    if (currentView === KNOWLEDGE_BASE) {
      return I18n.text('conversations-visitor-ui.knowledgeBaseContainer.headerText');
    } else if (currentView === THREAD_LIST) {
      return I18n.text('conversations-visitor-ui.knowledgeBaseContainer.chat');
    } else if (currentView === CATEGORY_VIEW) {
      if (selectedCategory.openedFromSdk && !selectedCategory.name) {
        return '';
      }
      return selectedCategory.name || I18n.text('conversations-visitor-ui.knowledgeBaseContainer.articleCategories.defaultHeader');
    }
  }
  return null;
});