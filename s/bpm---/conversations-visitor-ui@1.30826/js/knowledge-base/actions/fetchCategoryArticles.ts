import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategoryArticles } from 'conversations-visitor-experience-components/knowledge-base/clients/kb-api.v3';
import Raven from 'raven-js';
import { getVisitorIdentification } from '../../visitor-identity/operators/getVisitorIdentificationEnabled';
export const fetchCategoryArticles = createAsyncThunk('articles/fetchCategoryArticles', ({
  categoryId,
  knowledgeBaseId,
  knowledgeBaseUrl
}, {
  getState
}) => {
  const state = getState();
  const visitorIdentification = getVisitorIdentification(state);
  const {
    identificationToken,
    identificationEmail: email
  } = visitorIdentification;
  return getCategoryArticles({
    categoryId,
    knowledgeBaseId,
    knowledgeBaseUrl,
    identificationToken,
    email
  }).then(res => res).catch(error => {
    Raven.captureException(error);
    throw error;
  });
});