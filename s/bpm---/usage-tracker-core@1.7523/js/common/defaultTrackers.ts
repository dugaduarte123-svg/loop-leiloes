import * as cookieHelper from '../client/cookieHelper';
import anonymousStorage from '../containers/anonymousStorage';
import tempStorage from '../containers/tempStorage';
import { parseUtk } from '../identifiers';
import { readHamplitudeProperties } from '../metaProperties';
import { hstcKey, utkKey } from '../storageKeys';
import { lWindow } from './helpers';

// Retrieves the HubSpot HSTC from the HSTC Cookie
export function getHstc() {
  return cookieHelper.get(hstcKey) || null;
}

// Retrieves the HubSpot UTK from the UTK Cookie
// if available, otheriwse retrieves the HSTC
// and if available, extracts the UTK from the HSTC
export function getUtk() {
  var _ref;
  const hstc = getHstc();
  const utk = cookieHelper.get(utkKey);
  return (_ref = utk !== null && utk !== void 0 ? utk : parseUtk(hstc)) !== null && _ref !== void 0 ? _ref : null;
}

// Retrieves the in-App HubSpot Portal ID from the Window Object
export function getPortalId() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore hubspot is not necessarily defined
  const {
    hubspot = {
      portal: {}
    }
  } = lWindow || {};
  return 'portal' in hubspot && 'id' in hubspot.portal ? hubspot.portal.id : null;
}

// Retrieves the current running tracker DeviceID based on the correct
// storage that the tracker should be using based on if it's currently
// running on anonymous mode or not. Note that this is a best-effort method
// i.e.: If the current tracker running on the page is the "public" tracker
// despite there not being an UTK, then it will erroneously retrieve a wrong deviceId
// which is not used by the currently running tracker; For that we allow users to override
// the desired storage to be used.
// NOTE: This method will not always use the correct storage, please if you use a non-conventional
// setup, provide the desired storage to be used manually.
export function getDeviceId(storage = getUtk() || getPortalId() ? tempStorage : anonymousStorage) {
  const {
    device_id
  } = readHamplitudeProperties(storage.getItem, storage.setItem, {
    currentTime: Date.now()
  });
  return device_id;
}

// Retrieves the current running tracker SessionID based on the correct
// storage that the tracker should be using based on if it's currently
// running on anonymous mode or not. Note that this is a best-effort method
// i.e.: If the current tracker running on the page is the "public" tracker
// despite there not being an UTK, then it will erroneously retrieve a wrong SessionID
// which is not used by the currently running tracker; For that we allow users to override
// the desired storage to be used.
// NOTE: This method will not always use the correct storage, please if you use a non-conventional
// setup, provide the desired storage to be used manually.
export function getSessionId(storage = getUtk() || getPortalId() ? tempStorage : anonymousStorage) {
  const {
    session_id
  } = readHamplitudeProperties(storage.getItem, storage.setItem, {
    currentTime: Date.now()
  });
  return session_id;
}