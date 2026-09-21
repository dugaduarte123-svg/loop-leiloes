import { createSlice } from '@reduxjs/toolkit';
import { fetchRecommendedArticles } from '../actions/fetchRecommendedArticles';
import { fetchArticleCategories } from '../actions/fetchArticleCategories';
import { fetchCategoryArticles } from '../actions/fetchCategoryArticles';
import { UNINITIALIZED, PENDING, SUCCEEDED, FAILED } from 'conversations-internal-schema/constants/RequestStatusTypes';
const initialState = {
  recommendedArticles: [],
  articleCategories: [],
  selectedCategory: {
    name: '',
    id: -1,
    articles: [],
    openedFromSdk: false
  },
  requestStatus: {
    recommendedArticles: UNINITIALIZED,
    articleCategories: UNINITIALIZED,
    selectedCategoryArticles: UNINITIALIZED
  }
};
const kbLibrarySlice = createSlice({
  name: 'kbLibrary',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      const originalCategoryId = state.selectedCategory.id;
      const currentCategoryId = action.payload.id;
      state.selectedCategory.name = action.payload.openedFromSdk && !action.payload.name && originalCategoryId === currentCategoryId ? state.selectedCategory.name : action.payload.name;
      state.selectedCategory.id = currentCategoryId;
      state.selectedCategory.openedFromSdk = action.payload.openedFromSdk || false;
      if (originalCategoryId !== -1 && originalCategoryId !== currentCategoryId) {
        state.selectedCategory.articles = [];
        state.requestStatus.selectedCategoryArticles = UNINITIALIZED;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchRecommendedArticles.pending, state => {
      state.requestStatus.recommendedArticles = PENDING;
    }).addCase(fetchRecommendedArticles.fulfilled, (state, action) => {
      state.requestStatus.recommendedArticles = SUCCEEDED;
      state.recommendedArticles = action.payload;
    }).addCase(fetchRecommendedArticles.rejected, state => {
      state.requestStatus.recommendedArticles = FAILED;
    }).addCase(fetchArticleCategories.pending, state => {
      state.requestStatus.articleCategories = PENDING;
    }).addCase(fetchArticleCategories.fulfilled, (state, action) => {
      state.requestStatus.articleCategories = SUCCEEDED;
      state.articleCategories = action.payload;
    }).addCase(fetchArticleCategories.rejected, state => {
      state.requestStatus.articleCategories = FAILED;
    }).addCase(fetchCategoryArticles.pending, state => {
      state.requestStatus.selectedCategoryArticles = PENDING;
    }).addCase(fetchCategoryArticles.fulfilled, (state, action) => {
      var _action$payload;
      state.requestStatus.selectedCategoryArticles = SUCCEEDED;
      const results = Array.isArray(action.payload) ? action.payload : Array.isArray((_action$payload = action.payload) === null || _action$payload === void 0 ? void 0 : _action$payload.results) ? action.payload.results : [];
      state.selectedCategory.articles = results;
      if (state.selectedCategory.openedFromSdk) {
        if (!state.selectedCategory.name && results.length > 0) {
          state.selectedCategory.name = results[0].knowledgeCategoryName || '';
        }
        state.selectedCategory.openedFromSdk = false;
      }
    }).addCase(fetchCategoryArticles.rejected, state => {
      state.requestStatus.selectedCategoryArticles = FAILED;
    });
  }
});
export const {
  setSelectedCategory
} = kbLibrarySlice.actions;
export default kbLibrarySlice.reducer;