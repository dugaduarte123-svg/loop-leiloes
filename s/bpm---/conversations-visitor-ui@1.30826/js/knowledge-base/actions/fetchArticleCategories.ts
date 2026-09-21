import { createAsyncThunk } from '@reduxjs/toolkit';
import { getArticleCategories } from 'conversations-visitor-experience-components/knowledge-base/clients/kb-api.v3';
import Raven from 'raven-js';
import { getVisitorIdentification } from '../../visitor-identity/operators/getVisitorIdentificationEnabled';
export const fetchArticleCategories = createAsyncThunk('articles/fetchArticleCategories', ({
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
  return getArticleCategories({
    knowledgeBaseId,
    knowledgeBaseUrl,
    identificationToken,
    email
  }).then(response => response).catch(error => {
    Raven.captureException(error);
    throw error;
  });
});