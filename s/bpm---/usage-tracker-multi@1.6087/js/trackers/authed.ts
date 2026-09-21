import { createTracker } from 'usage-tracker';
import { getUuidFromUrl, resetAmplitudeStorageIfNeeded } from '../utils';
export default {
  init: options => createTracker(options),
  switch: (from, {
    history: {
      location,
      replace
    },
    storeUuidOnUrl
  }) => {
    if (from === undefined || from === 'anonymous') {
      if (storeUuidOnUrl === true) {
        const searchParams = new URLSearchParams(location.search);
        const uuidQueryParam = getUuidFromUrl(location);

        // If an UUID is present on the localStorage then we
        // need to erase the UUID from the Query Params
        // and do any necessary/possible cleanup
        if (uuidQueryParam !== undefined) {
          resetAmplitudeStorageIfNeeded(uuidQueryParam);
          searchParams.delete('uuid');
          replace(`${location.pathname}?${searchParams}`);
        }
      }
    }
  }
};