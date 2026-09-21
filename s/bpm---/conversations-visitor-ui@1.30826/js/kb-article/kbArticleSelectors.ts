import { useAppSelector } from '../buildStore';
export const getKBArticle = state => {
  return state.kbArticle.data;
};
export const getOriginViewContext = state => {
  return state.kbArticle.originViewContext;
};
export const getShouldViewKBArticleExpanded = state => {
  return state.kbArticle.viewExpanded;
};
export const useKBArticle = () => {
  return useAppSelector(getKBArticle);
};
export const useKBArticleOriginViewContext = () => {
  return useAppSelector(getOriginViewContext);
};