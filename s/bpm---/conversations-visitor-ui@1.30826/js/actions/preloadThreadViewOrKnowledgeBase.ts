import { getKnowledgeBaseEnabled } from '../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { lazyWithPreload } from '../utils/lazyWithPreload';
const ThreadView = lazyWithPreload(() => import( /* webpackChunkName: "CurrentView-ThreadView" */'../components/ThreadView'));
const KnowledgeBaseContainer = lazyWithPreload(() => import( /* webpackChunkName: "CurrentView-KnowledgeBaseContainer" */'../knowledge-base/components/KnowledgeBaseContainerV2'));
export const preloadThreadViewOrKnowledgeBase = () => (_, getState) => {
  if (getKnowledgeBaseEnabled(getState())) {
    KnowledgeBaseContainer.preload().catch(e => {
      throw e;
    });
  } else {
    ThreadView.preload().catch(e => {
      throw e;
    });
  }
};