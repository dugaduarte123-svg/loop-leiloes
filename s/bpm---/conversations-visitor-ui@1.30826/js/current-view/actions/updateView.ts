import invariant from 'react-utils/invariant';
import { createAction } from '@reduxjs/toolkit';
import { UPDATE_VIEW } from '../constants/actionTypes';
import { THREAD_LIST, THREAD_VIEW, KNOWLEDGE_BASE, KNOWLEDGE_BASE_ARTICLE, CATEGORY_VIEW } from 'conversations-visitor-experience-components/visitor-widget/constants/views';
export const updateViewAction = createAction(UPDATE_VIEW, view => ({
  payload: {
    view
  }
}));
export const updateView = view => dispatch => {
  invariant([THREAD_LIST, THREAD_VIEW, KNOWLEDGE_BASE, KNOWLEDGE_BASE_ARTICLE, CATEGORY_VIEW].includes(view), '`updateView` expected to be called with a valid `view` argument, but received "%s"', view);
  dispatch(updateViewAction(view));
};