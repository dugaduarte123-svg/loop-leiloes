import anonymousStorage from 'usage-tracker-core/containers/anonymousStorage';
import tempStorage from 'usage-tracker-core/containers/tempStorage';
import { hamplitudeKey } from 'usage-tracker-core/storageKeys';

// This attempts to get an UUID from the URL, if it doesn't exist it will simply return undefined
export const getUuidFromUrl = location => {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get('uuid') || undefined;
};
export const resetAmplitudeStorageIfNeeded = deviceId => {
  var _tempStorage$getItem;
  // If we have the same deviceId stored on the localStorage we should reset that
  // since we shouldn't identify the same user with different devices
  if ((_tempStorage$getItem = tempStorage.getItem(hamplitudeKey)) !== null && _tempStorage$getItem !== void 0 && _tempStorage$getItem.includes(deviceId)) {
    tempStorage.removeItem(hamplitudeKey);
  }

  // When switching from anonymous to non-anonymous we want to clear the
  // anonymous tracker sessionStorage
  anonymousStorage.removeItem(hamplitudeKey);
};