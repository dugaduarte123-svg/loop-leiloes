import hubspot from 'hubspot';
import quickFetch from 'quick-fetch';

// The different categories of hub-http fetches we want to keep tabs on.

const getRequestType = url => {
  if (url.includes('/graphql/crm')) {
    return 'graphql';
  }
  if (url.includes('/chirp-')) {
    return 'chirp';
  }
  return 'rest';
};

/**
 * Converts quick-fetch early request history entries to the hub-http HttpRequestStats format
 * so they can be merged and counted together in metrics.
 */
const convertQuickFetchToHttpStats = (qfStats, finishedTimestamp) => {
  return qfStats.filter(req => {
    // Only include requests that started before this route finished
    return req.started < finishedTimestamp;
  }).map(req => {
    var _req$statusCode;
    return {
      url: req.url,
      state: req.state,
      started: req.started,
      finished: req.finished || finishedTimestamp,
      status: (_req$statusCode = req.statusCode) !== null && _req$statusCode !== void 0 ? _req$statusCode : req.state === 'succeeded' ? 200 : 0,
      willBeRetried: false // Quick-fetch doesn't support retries
    };
  });
};
const computeMetricsForRequests = (requests, finishedTimestamp) => {
  const byStatus = status => ({
    state,
    started,
    finished
  }) => started < finishedTimestamp && (status === 'pending' ? state === 'pending' || finished > finishedTimestamp : state === status && finished <= finishedTimestamp);
  const succeededRequests = requests.filter(byStatus('succeeded'));
  const failedRequests = requests.filter(byStatus('failed'));
  const abortedRequests = requests.filter(byStatus('aborted'));
  const pendingRequests = requests.filter(byStatus('pending'));
  const timedOutRequests = requests.filter(byStatus('timedOut'));
  const failedRequestsMinus404AndRetries = failedRequests.filter(r => r.status !== 404 && !r.willBeRetried);
  const notFoundRequests = failedRequests.filter(r => r.status === 404);
  return {
    numSucceededRequests: succeededRequests.length,
    numAbortedRequests: abortedRequests.length,
    numPendingRequests: pendingRequests.length,
    numNotFound: notFoundRequests.length,
    numTimedoutRequests: timedOutRequests.length,
    numFailedRequestsMinus404AndRetries: failedRequestsMinus404AndRetries.length,
    numRetriedFailures: failedRequests.filter(r => !!r.willBeRetried).length
  };
};
export const getHubHttpData = finishedTimestamp => {
  let allRequests = [];

  // Get hub-http tracked requests
  if (typeof hubspot.getAllHttpRequestStats === 'function') {
    allRequests = hubspot.getAllHttpRequestStats();
  }

  // Get quick-fetch early request history and merge with hub-http requests
  const qfRequests = quickFetch.getAllEarlyRequestStats();
  const convertedRequests = convertQuickFetchToHttpStats(qfRequests, finishedTimestamp);
  allRequests = allRequests.concat(convertedRequests);

  // If we have no requests from either source, return null
  if (allRequests.length === 0) {
    return null;
  }

  // Process the merged requests
  const byStatus = status => ({
    state,
    started,
    finished
  }) => started < finishedTimestamp && (status === 'pending' ? state === 'pending' || finished > finishedTimestamp : state === status && finished <= finishedTimestamp);
  const MAX_URLS = 10;
  const toUrls = arr => arr.slice(0, MAX_URLS).map(r => r.url).join(',');
  const requests = allRequests;
  const succeededRequests = requests.filter(byStatus('succeeded'));
  const failedRequests = requests.filter(byStatus('failed'));
  const abortedRequests = requests.filter(byStatus('aborted'));
  const pendingRequests = requests.filter(byStatus('pending'));
  const timedOutRequests = requests.filter(byStatus('timedOut'));
  const failedRequestsMinus404AndRetries = failedRequests.filter(r => r.status !== 404 && !r.willBeRetried);
  const notFoundRequests = failedRequests.filter(r => r.status === 404);
  const graphqlRequests = requests.filter(r => getRequestType(r.url) === 'graphql');
  const chirpRequests = requests.filter(r => getRequestType(r.url) === 'chirp');
  const restRequests = requests.filter(r => getRequestType(r.url) === 'rest');
  return {
    numSucceededRequests: succeededRequests.length,
    numAbortedRequests: abortedRequests.length,
    numPendingRequests: pendingRequests.length,
    numNotFound: notFoundRequests.length,
    numTimedoutRequests: timedOutRequests.length,
    numFailedRequestsMinus404AndRetries: failedRequestsMinus404AndRetries.length,
    numRetriedFailures: failedRequests.filter(r => !!r.willBeRetried).length,
    failedRequestUrls: toUrls(failedRequestsMinus404AndRetries),
    timedOutRequestUrls: toUrls(timedOutRequests),
    pendingRequestUrls: toUrls(pendingRequests),
    notFoundUrls: toUrls(notFoundRequests),
    byRequestType: {
      graphql: computeMetricsForRequests(graphqlRequests, finishedTimestamp),
      chirp: computeMetricsForRequests(chirpRequests, finishedTimestamp),
      rest: computeMetricsForRequests(restRequests, finishedTimestamp)
    }
  };
};

/**
 * Clears the quick-fetch early request history.
 * Should be called when starting a new route navigation to avoid double-counting
 * early requests across multiple page navigations.
 */
export const clearQuickFetchHistory = () => {
  quickFetch.clearEarlyRequestHistory();
};