let inflightFetchCount = 0;
export const getInflightFetchCount = () => inflightFetchCount;

/**
 * POSTs tracking events to the given endpoint. Rejects with an enriched Error
 * for non-2xx replies, attaching `statusCode` and `correlationId` (from the
 * x-hubspot-correlation-id header). This mirrors the metadata raven-hubspot
 * attaches to fetch breadcrumbs automatically so error handlers downstream
 * receive the same context visible in the LogFetch Errors UI.
 *
 * @see https://git.hubteam.com/HubSpotEngineering/raven-hubspot/blob/master/raven/static/js/raven.js
 * @see https://git.hubteam.com/HubSpotEngineering/raven-hubspot/blob/master/raven/static/js/utils/getCorrelationId.ts
 */
export const sendEventsViaFetch = async (endpoint, {
  data
}) => {
  inflightFetchCount++;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // fetch() only rejects on network failure; a 4xx/5xx still resolves.
    // Throw an enriched error so callers' .catch handlers fire for server errors too.
    if (!response.ok) {
      throw Object.assign(new Error(`HTTP ${response.status}`), {
        statusCode: response.status,
        correlationId: response.headers.get('x-hubspot-correlation-id')
      });
    }
    return response;
  } finally {
    // Always decrement, whether the request succeeded, returned a non-2xx, or threw.
    inflightFetchCount--;
  }
};