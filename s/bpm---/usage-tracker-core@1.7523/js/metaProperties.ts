import { isPrerendering } from './client/browserHelper';
import * as helpers from './common/helpers';
import * as storageKeys from './storageKeys';
const SESSION_LENGTH_IN_MILLISECONDS = 1000 * 60 * 30; // 30 minutes

const OPERATING_SYSTEMS = [{
  name: 'windows 10',
  pattern: /(Windows 10.0|Windows NT 10.0)/
}, {
  name: 'windows 8',
  pattern: /(Windows 8|Windows8.1|Windows NT 6.2|Windows NT 6.3)/
}, {
  name: 'windows 7',
  pattern: /(Windows 7|Windows NT 6.1)/
}, {
  name: 'windows vista',
  pattern: /Windows NT 6.0/
}, {
  name: 'windows xp',
  pattern: /(Windows NT 5.1|Windows XP)/
}, {
  name: 'android',
  pattern: /Android/
}, {
  name: 'linux',
  pattern: /(Linux|X11)/
}, {
  name: 'ios',
  pattern: /(iPhone|iPad|iPod)/
}, {
  name: 'mac',
  pattern: /Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh/
}];
const getDefaultHamplitudeProperties = time => ({
  device_id: helpers.makeUuid(),
  last_event_id: 0,
  last_sequence_number: 0,
  last_timestamp_checked_against_session: time,
  session_id: time
});
const getHamplitudeProperties = getTempStorage => {
  const storageProperties = getTempStorage(storageKeys.hamplitudeKey);
  if (storageProperties) {
    try {
      return JSON.parse(storageProperties);
    } catch (err) {
      // noop
    }
  }
  return null;
};
const setHamplitudeProperties = (setTempStorage, hamplitudeProperties) => setTempStorage(storageKeys.hamplitudeKey, JSON.stringify(hamplitudeProperties));
// Advances the properties for a single dispatched event. This must run exactly
// once per dispatched `.track()` and never on a read of the device/session id
// (see #2917). It increments the per-session `last_event_id` and the
// device-lifetime `last_sequence_number` by one, rolling the session (and
// restarting the per-session counter) at each device/session boundary.
export const refreshHamplitudeProperties = (hamplitudeProperties, {
  currentTime,
  deviceId
}) => {
  const {
    device_id,
    last_event_id = 0,
    last_sequence_number = 0,
    last_timestamp_checked_against_session = currentTime,
    session_id = currentTime
  } = hamplitudeProperties;

  // A different deviceId means a different user/device, so we start a brand new
  // device lifetime + session. The event being dispatched is the first one, so
  // both counters start at 1.
  if (deviceId && deviceId !== device_id) {
    return {
      device_id: deviceId,
      last_event_id: 1,
      last_sequence_number: 1,
      last_timestamp_checked_against_session: currentTime,
      session_id: currentTime
    };
  }

  // A session expires after 30 minutes without a dispatched event. On expiry we
  // start a new session and reset the per-session `last_event_id` so that, once
  // incremented below, the first event of the new session is `1` and events
  // within a session form a contiguous `1..N`.
  const isSessionExpired = currentTime - last_timestamp_checked_against_session > SESSION_LENGTH_IN_MILLISECONDS;
  const refreshed = {
    device_id,
    last_event_id: isSessionExpired ? 0 : last_event_id,
    last_sequence_number,
    last_timestamp_checked_against_session: currentTime,
    session_id: isSessionExpired ? currentTime : session_id
  };

  // A real event is being dispatched, so advance both counters exactly once.
  refreshed.last_event_id += 1;
  refreshed.last_sequence_number += 1;
  return refreshed;
};

// Reads the properties without mutating session state: it never advances the
// counters or rolls the session (see #2917). On first use it mints — and
// persists once — a fresh `device_id`/`session_id`; otherwise it returns the
// stored properties as-is. This is the path used by `getDeviceId`/`getSessionId`.
export const readHamplitudeProperties = (getTempStorage, setTempStorage, {
  currentTime
}) => {
  const storedHamplitudeProperties = getHamplitudeProperties(getTempStorage);
  if (storedHamplitudeProperties) {
    return storedHamplitudeProperties;
  }
  const createdHamplitudeProperties = getDefaultHamplitudeProperties(currentTime);
  setHamplitudeProperties(setTempStorage, createdHamplitudeProperties);
  return createdHamplitudeProperties;
};

// Advances the stored properties for a dispatched event and persists the
// result. This is the per-`.track()` path (see `getDynamicMetaProperties`).
export const advanceHamplitudeProperties = (getTempStorage, setTempStorage, {
  currentTime,
  deviceId
}) => {
  const currentHamplitudeProperties = getHamplitudeProperties(getTempStorage) || getDefaultHamplitudeProperties(currentTime);
  const hamplitudeProperties = refreshHamplitudeProperties(currentHamplitudeProperties, {
    currentTime,
    deviceId
  });
  setHamplitudeProperties(setTempStorage, hamplitudeProperties);
  return hamplitudeProperties;
};
const lookupOperatingSystem = fingerprint => {
  const match = OPERATING_SYSTEMS.find(({
    pattern
  }) => pattern.test(fingerprint));
  return match ? match.name : 'unknown';
};

// These are Properties always sent on the Event Payload
// and that have dynamic values that are recalculated on each `.track` call
export const getDynamicMetaProperties = ({
  deviceId,
  getCurrentHref,
  getNetworkType,
  getNetworkSpeed,
  getTempStorage,
  setTempStorage
}) => {
  const currentTime = Date.now();
  const hamplitudeProperties = advanceHamplitudeProperties(getTempStorage, setTempStorage, {
    currentTime,
    deviceId
  });
  const dynamicProperties = Object.assign({}, hamplitudeProperties, {
    timestamp: currentTime,
    currentPageUrl: '',
    networkType: '',
    networkSpeed: '',
    prerendering: false
  });
  dynamicProperties.prerendering = isPrerendering();
  dynamicProperties.currentPageUrl = helpers.truncate(getCurrentHref(), 256);
  dynamicProperties.networkType = getNetworkType();
  dynamicProperties.networkSpeed = getNetworkSpeed();
  return dynamicProperties;
};

// These are Properties always sent on the Event Payload
// and that have static value (properties defined when the client is created)
export const getStaticMetaProperties = ({
  clientName,
  getReferrer,
  getUserAgent,
  getScreenWidth,
  getScreenHeight,
  getWindowWidth,
  getWindowHeight,
  getDeployableName,
  getDeployableVersion,
  getHubSpotSessionId
}) => {
  const staticProperties = {
    windowWidth: -1,
    windowHeight: -1,
    screenWidth: -1,
    screenHeight: -1,
    screenSize: '',
    lastPageUrl: '',
    howOsDetailed: '',
    singlePageAppSessionId: Date.now(),
    trackingClient: clientName || 'custom',
    deployableName: '',
    deployableVersion: '',
    hubspotSessionId: ''
  };
  staticProperties.windowWidth = getWindowWidth();
  staticProperties.windowHeight = getWindowHeight();
  staticProperties.deployableName = getDeployableName();
  staticProperties.deployableVersion = getDeployableVersion();
  staticProperties.hubspotSessionId = getHubSpotSessionId();
  staticProperties.howOsDetailed = lookupOperatingSystem(helpers.between(getUserAgent(), '(', ')'));
  staticProperties.screenWidth = getScreenWidth();
  staticProperties.screenHeight = getScreenHeight();
  staticProperties.screenSize = helpers.getScreenWidthSize(getScreenWidth());
  staticProperties.lastPageUrl = helpers.truncate(getReferrer(), 256);
  return staticProperties;
};

// Combined type for all meta properties (static + dynamic)

export const getMetaProperties = (staticProperties, dynamicProperties) => {
  // metaProperties = properties that get stamped to each event
  // staticProperties = properties that get set once on tracker initialisation
  // dynamicProperties = properties that can change for each event
  const metaProperties = Object.assign({}, dynamicProperties, staticProperties);
  const emptyProperties = helpers.getObjectKeys(metaProperties).filter(key => !metaProperties[key]);

  // We cast the emptyProperties as [] since the emptyProperties are evaluated
  // during runtime, and we don't know which ones are empty during build time.
  return helpers.omit(metaProperties, emptyProperties);
};