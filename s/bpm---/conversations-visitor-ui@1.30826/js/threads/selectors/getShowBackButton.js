'use es6';

import {
    createSelector
} from '@reduxjs/toolkit';
import {
    getThreadList
} from './getThreadList';
import {
    getCurrentView
} from '../../current-view/selectors/getCurrentView';
import {
    THREAD_LIST,
    KNOWLEDGE_BASE
} from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import {
    getShowPreviousConversations
} from '../../widget-data/selectors/getShowPreviousConversations';
import {
    getKnowledgeBaseEnabled
} from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
const getIsThreadListView = createSelector([getCurrentView], currentView => {
    return currentView === THREAD_LIST;
});
const getIsKnowledgeBaseView = createSelector([getCurrentView], currentView => {
    return currentView === KNOWLEDGE_BASE;
});
export const getShowBackButton = createSelector([getThreadList, getIsThreadListView, getShowPreviousConversations, getIsKnowledgeBaseView, getKnowledgeBaseEnabled], (threads, isThreadListRoute, showPreviousConversations, isKnowledgeBaseView, knowledgeBaseEnabled) => {
    if (isThreadListRoute || isKnowledgeBaseView) {
        return false;
    }
    if (knowledgeBaseEnabled) {
        return true;
    }
    if (!showPreviousConversations || !threads) {
        return false;
    }
    const numThreads = threads.size;
    const hasThreadsForThreadList = numThreads > 0;
    return hasThreadsForThreadList;
});