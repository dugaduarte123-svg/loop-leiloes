import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRecommendedArticles } from 'conversations-visitor-experience-components/knowledge-base/clients/kb-api.v3';
import Raven from 'raven-js';
import { getKnowledgeBaseRecommendationType } from '../../widget-data/selectors/getKnowledgeBaseRecommendationType';
import { getVisitorIdentification } from '../../visitor-identity/operators/getVisitorIdentificationEnabled';
export const fetchRecommendedArticles = createAsyncThunk('articles/fetchRecommendedArticles', ({
  knowledgeBaseId,
  knowledgeBaseUrl
}, {
  getState
}) => {
  const state = getState();
  const kbRecommendationType = getKnowledgeBaseRecommendationType(state);
  const visitorIdentification = getVisitorIdentification(state);
  const {
    identificationToken,
    identificationEmail: email
  } = visitorIdentification;
  getKnowledgeBaseRecommendationType(state);
  return getRecommendedArticles({
    knowledgeBaseId,
    knowledgeBaseUrl,
    kbRecommendationType,
    identificationToken,
    email
  }).then(response => response ? response.results : []).catch(error => {
    Raven.captureException(error);
    throw error;
  });
});