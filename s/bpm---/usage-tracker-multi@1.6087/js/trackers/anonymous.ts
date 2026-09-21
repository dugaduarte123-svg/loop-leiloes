import { createTracker } from 'usage-tracker-anonymous';
import { getDeviceId } from 'usage-tracker-core/common/defaultTrackers';
import anonymousStorage from 'usage-tracker-core/containers/anonymousStorage';
import { getUuidFromUrl } from '../utils';
export default {
  init: (options, {
    history: {
      location
    },
    storeUuidOnUrl
  }) => {
    const tracker = createTracker(options);

    // Attempts to retrieve an existing deviceId from the URL or from the sessionStorage
    // but if neither methods worked, then it either means that we're not storing
    // UUID on the URL due to (storeUuidOnUrl) or we failed to set an UUID on the URL
    // This is a fallback that ensures that we always have an UUID and are able to do anonymous tracking
    const deviceIdFromUrl = storeUuidOnUrl ? getUuidFromUrl(location) : undefined;
    tracker.setProperties({
      // If we don't have an UUID from the URL, then we fallback to the usage-tracker-core's
      // Which if doesn't exist, it will generate a new one and store it on the anonymousStorage
      deviceId: deviceIdFromUrl || getDeviceId(anonymousStorage)
    });
    return tracker;
  },
  switch: (_, {
    history: {
      location,
      replace
    },
    storeUuidOnUrl
  }) => {
    // Allow consumers to decide if they want to store the UUID on the URL
    if (storeUuidOnUrl === true) {
      // Note: In the future we want to first attempt to retrieve the UUID from the sessionStorage
      let uuidQueryParam = getUuidFromUrl(location);

      // Validates if either an existing UUID is present or not
      // or if it has some sort of weird format (should always be smaller or equal than 64 characters)
      if (uuidQueryParam === undefined || uuidQueryParam.length > 64) {
        // If not, attempt to retrieve an existing UUID from the usage-tracker-core storage
        // or generate a new one and store it on the storage
        uuidQueryParam = getDeviceId(anonymousStorage);
      }
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('uuid', uuidQueryParam);
      replace(`${location.pathname}?${searchParams}`);
    }
  }
};