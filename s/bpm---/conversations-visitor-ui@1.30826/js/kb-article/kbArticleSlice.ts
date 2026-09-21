import { createSlice } from '@reduxjs/toolkit';
import { THREAD_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
const initialState = {
  data: {
    deepLink: '',
    hubSpotContentId: '',
    hubSpotContentTextFragment: ''
  },
  originViewContext: {
    view: THREAD_VIEW
  },
  viewExpanded: true
};
const kbArticleSlice = createSlice({
  name: 'kbArticle',
  initialState,
  reducers: {
    setKBArticle(state, action) {
      state.data = action.payload;
    },
    setOriginViewContext(state, action) {
      state.originViewContext = action.payload;
    },
    setViewExpanded(state, action) {
      state.viewExpanded = action.payload;
    }
  }
});
export const {
  setKBArticle,
  setOriginViewContext,
  setViewExpanded
} = kbArticleSlice.actions;
export default kbArticleSlice.reducer;