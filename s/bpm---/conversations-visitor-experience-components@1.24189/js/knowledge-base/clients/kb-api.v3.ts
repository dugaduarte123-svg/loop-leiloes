import PortalIdParser from 'PortalIdParser';
import noAuthHttp from 'conversations-http/clients/noAuthApiClient';
import { getThirtyDaysAgoFormatted, getTodayFormatted } from '../utils/getFormattedDate';
import Raven from 'raven-js';
import { buildKBApiUrl } from './buildKBApiUrl';
function getDomainFromUrl(knowledgeBaseUrl) {
  try {
    return new URL(knowledgeBaseUrl).hostname;
  } catch (error) {
    Raven.captureException(new Error('Invalid knowledge base URL'));
    return '';
  }
}
function fetchArticles({
  knowledgeBaseId,
  knowledgeBaseUrl,
  kbRecommendationType,
  identificationToken,
  email
}) {
  const domain = getDomainFromUrl(knowledgeBaseUrl);
  const portalId = PortalIdParser.get();
  const prefix = !kbRecommendationType || kbRecommendationType === 'TRENDING' ? 'most-viewed' : 'most-helpful';
  const url = buildKBApiUrl(domain, `${prefix}-articles`, {
    portalId,
    knowledgeBaseId,
    identificationToken,
    email
  });
  return noAuthHttp.post(url, {
    withCredentials: true,
    data: {
      startDate: getThirtyDaysAgoFormatted(),
      endDate: getTodayFormatted(),
      knowledgeBaseId,
      limit: 5
    }
  });
}
export function getRecommendedArticles({
  knowledgeBaseId,
  knowledgeBaseUrl,
  kbRecommendationType,
  identificationToken,
  email
}) {
  return fetchArticles({
    knowledgeBaseId,
    knowledgeBaseUrl,
    kbRecommendationType,
    identificationToken,
    email
  });
}
export function getArticleCategories({
  knowledgeBaseId,
  knowledgeBaseUrl,
  identificationToken,
  email
}) {
  const domain = getDomainFromUrl(knowledgeBaseUrl);
  if (!domain) {
    throw new Error('Invalid knowledge base URL');
  }
  const portalId = PortalIdParser.get();
  const url = buildKBApiUrl(domain, 'categories-with-count', {
    portalId,
    knowledgeBaseId,
    identificationToken,
    email
  });
  return noAuthHttp.get(url, {
    withCredentials: true
  });
}
export function getCategoryArticles({
  categoryId,
  knowledgeBaseId,
  knowledgeBaseUrl,
  identificationToken,
  email
}) {
  const domain = getDomainFromUrl(knowledgeBaseUrl);
  if (!domain) {
    throw new Error('Invalid knowledge base URL');
  }
  const portalId = PortalIdParser.get();
  const url = buildKBApiUrl(domain, 'articles-in-category', {
    portalId,
    knowledgeBaseId,
    categoryId,
    identificationToken,
    email
  });
  return noAuthHttp.get(url, {
    withCredentials: true
  });
}