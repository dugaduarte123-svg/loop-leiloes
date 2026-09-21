import { getFullUrl } from 'hubspot-url-utils';
import { createClient } from 'usage-tracker-core';
import { genericClient } from 'usage-tracker-core/client';
import { sendEventsViaFetch } from 'usage-tracker-core/client/fetchClient';
import { ensureFn } from 'usage-tracker-core/common/helpers';
import { DEFAULT_TRACK_ENDPOINT } from 'usage-tracker-core/constants';
import { attemptToGetCookieHstc } from './utils';
const origin = getFullUrl('app-api');
const reportNetworkError = err => {
  return genericClient.reportError(err, {
    fingerprint: ['usage-tracker-js', 'network', DEFAULT_TRACK_ENDPOINT],
    extra: {
      endpoint: DEFAULT_TRACK_ENDPOINT
    }
  });
};
const publicTrackingClient = createClient({
  clientName: 'public',
  getDebug: genericClient.getDebug,
  getLang: genericClient.getLang,
  getTempStorage: genericClient.getTempStorage,
  setTempStorage: genericClient.setTempStorage,
  logWarning: genericClient.logWarning,
  logError: genericClient.logError,
  reportWarning: genericClient.reportWarning,
  reportError: genericClient.reportError,
  getHstc: attemptToGetCookieHstc,
  getEmail: () => null,
  getHubId: () => null,
  send: ({
    events: data,
    query = '',
    onFailure
  }) => {
    const endpoint = `${origin}${DEFAULT_TRACK_ENDPOINT}?${query}`;
    const handleRequestFailure = error => {
      reportNetworkError(error);
      ensureFn(onFailure)();
    };
    const sendXhr = () => {
      sendEventsViaFetch(endpoint, {
        data
      }).catch(handleRequestFailure);
    };
    genericClient.sendBeacon(endpoint, data, sendXhr);
  }
});
export default publicTrackingClient;