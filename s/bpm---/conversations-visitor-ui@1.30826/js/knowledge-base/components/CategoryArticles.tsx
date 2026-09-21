import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategoryArticles } from '../actions/fetchCategoryArticles';
import { getSelectedCategory, getRequestStatusSelectedCategoryArticles } from '../selectors/kbLibrarySelectors';
import styled from 'styled-components';
import LoadingState from '../../components/LoadingState';
import { getSearchableKnowledgeBaseIds } from '../../widget-data/selectors/widgetDataSelectors';
import { PENDING, UNINITIALIZED } from 'conversations-internal-schema/constants/RequestStatusTypes';
import { Section } from './Section';
import { getKnowledgeBaseUrl } from '../../selectors/widgetDataSelectors/getKnowledgeBaseUrl';
import { useAppSelector } from '../../buildStore';
import ArticlesList from 'conversations-visitor-experience-components/knowledge-base/ArticlesList';
import { getColoring } from '../../selectors/widgetDataSelectors/getColoring';
import { handleArticleClick } from '../actions/handleArticleClick';
import { useBrowserWindowContext } from '../../components/BrowserWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
const CategoryArticlesWrapper = styled.div.withConfig({
  displayName: "CategoryArticles__CategoryArticlesWrapper"
})(["height:100%;overflow-y:scroll;"]);
export default function CategoryArticles() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector(getSelectedCategory);
  const {
    id: categoryId
  } = selectedCategory;
  const [knowledgeBaseId] = useSelector(getSearchableKnowledgeBaseIds);
  const knowledgeBaseUrl = useAppSelector(getKnowledgeBaseUrl);
  const requestStatusSelectedCategoryArticles = useSelector(getRequestStatusSelectedCategoryArticles);
  const coloring = useSelector(getColoring);
  const {
    browserWindowHeight
  } = useBrowserWindowContext();
  useEffect(() => {
    var _selectedCategory$art;
    if (!(selectedCategory !== null && selectedCategory !== void 0 && (_selectedCategory$art = selectedCategory.articles) !== null && _selectedCategory$art !== void 0 && _selectedCategory$art.length) && requestStatusSelectedCategoryArticles === UNINITIALIZED && categoryId !== -1) {
      void dispatch(fetchCategoryArticles({
        categoryId,
        knowledgeBaseId,
        knowledgeBaseUrl
      }));
    }
  }, [dispatch, categoryId, knowledgeBaseId, knowledgeBaseUrl, selectedCategory.articles, requestStatusSelectedCategoryArticles]);
  const onArticleClick = useCallback(article => {
    dispatch(handleArticleClick(article.id, article.url, browserWindowHeight));
  }, [dispatch, browserWindowHeight]);
  if (requestStatusSelectedCategoryArticles === PENDING) {
    return /*#__PURE__*/_jsx(LoadingState, {});
  }
  return /*#__PURE__*/_jsx(CategoryArticlesWrapper, {
    children: /*#__PURE__*/_jsx(Section, {
      children: /*#__PURE__*/_jsx(ArticlesList, {
        hideSubtitle: true,
        items: selectedCategory.articles,
        coloring: coloring,
        onArticleClick: onArticleClick
      })
    })
  });
}
CategoryArticles.displayName = 'CategoryArticles';