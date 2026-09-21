import enviro from 'enviro';
import { lWindow } from '../common/helpers';
import { HUBSPOT_DOMAINS_REGEX } from '../constants';
import { debugKey } from '../storageKeys';
const createBrowserHelper = localWindow => {
  // This one requires a Type Guard as Raven is not defined standarly
  // within the `window` object hence why the `prop` is set to `any`
  // This is a TypeScript limitation as TS cannot infer the Factory argument
  // And pass down to the sibling usages of this function
  const hasRaven = prop => {
    return typeof prop['Raven'] === 'object' && typeof prop['Raven'].captureException === 'function' && typeof prop['Raven'].captureMessage === 'function';
  };

  // Here we check agains the "actual" `window` object
  // even tho `lWindow` is a safe-guarded version of the `window` object
  // We want to check this against the real `window` object to determine Browser environment
  if (typeof window === 'undefined' || typeof localWindow === 'undefined') {
    let _isDocumentReadyTimeout = 0;
    let _isDocumentReady = false;
    return {
      hasRaven,
      addEventListener: () => false,
      dispatchWindowEvent: () => false,
      isDocumentVisible: () => false,
      isDocumentReady: () => {
        if (_isDocumentReady || _isDocumentReadyTimeout) {
          return _isDocumentReady;
        }
        _isDocumentReadyTimeout = setTimeout(() => {
          // We wait for around 5 seconds before assuming that the document is ready
          // This happens as we don't really know if the page orn the environment that
          // usage-tracker was injected into has finished loading. We also do that
          // As we want to create a deferred approach for sending the events over the network
          _isDocumentReady = true;
        }, 5000);
        return _isDocumentReady;
      },
      isLocalDeployment: false,
      isQaDeployment: false,
      isProdDeployment: true,
      isDebugEnabled: false,
      isHubSpotDomain: false,
      hasLocalStorage: false,
      hasCookieAccess: false,
      hasBeaconSupport: false,
      isPrerendering: () => false
    };
  }
  const hasLocalStorage = () => {
    try {
      return Boolean(localWindow.localStorage);
    } catch (err) {
      // window.localStorage might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `window` will deny your access to the localStorage
      return false;
    }
  };
  const hasCookieAccess = () => {
    const {
      navigator,
      document
    } = localWindow;
    try {
      return typeof navigator === 'object' && navigator.cookieEnabled || typeof document === 'object' && Boolean(document.cookie);
    } catch (err) {
      // document.cookie might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `document` will deny your access on the document cookie
      return false;
    }
  };
  const hasBeaconSupport = () => {
    const {
      navigator
    } = localWindow;
    try {
      return typeof navigator === 'object' && typeof navigator['sendBeacon'] === 'function';
    } catch (err) {
      // navigator.sendBeacon might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `navigator` will deny your access on sendBeacon capabilities
      return false;
    }
  };
  const hasLocationApi = () => {
    const {
      location
    } = localWindow;
    try {
      return typeof location === 'object' && 'search' in location;
    } catch (err) {
      // window.location might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `location` will deny your access on the location object
      return false;
    }
  };
  const isDocumentReady = () => {
    const {
      document
    } = localWindow;
    try {
      return typeof document === 'object' && typeof document['readyState'] === 'string' && document.readyState === 'complete';
    } catch (err) {
      // document.readyState might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `document` will deny your access on the document cookie
      return false;
    }
  };
  const isDocumentVisible = () => {
    const {
      document
    } = localWindow;
    try {
      return typeof document === 'object' && typeof document['visibilityState'] === 'string' && document.visibilityState === 'visible';
    } catch (err) {
      // document.visibilityState might throw an exception if you're within an `iframe`
      // It might also throw on fake window (simulated) environments such as React Natvie
      // As the `document` will deny your access on the document cookie
      return false;
    }
  };
  const dispatchWindowEvent = (eventName, payload) => {
    const {
      document,
      CustomEvent
    } = localWindow;

    // In React Native document and navigator are not defined,
    // So we shouldn't dispatch `CustomEvent` as it is a browser-only specification
    // @see https://caniuse.com/customevent
    if (typeof document === 'object' && typeof CustomEvent === 'function') {
      const usageTrackerEvent = new CustomEvent(eventName, {
        detail: payload
      });
      return localWindow.dispatchEvent(usageTrackerEvent);
    }
    return false;
  };
  const addEventListener = (eventName, callback) => {
    const {
      document,
      addEventListener: addListener
    } = localWindow;

    // Even tho React Native has EventListeners, for the sort of Events we use here
    // such as `beforeunload` or `visibilitychange` or other Events
    if (typeof document === 'object' && typeof addListener === 'function') {
      try {
        // We don't really care much about type safety over here
        return addListener(eventName, callback);
      } catch (err) {
        // Some environments (notably iOS in-app WebViews) inject a wrapper around
        // `addEventListener` that throws — e.g. a WeakMap-backed listener registry
        // keyed by the event-name string. Registering a listener is best-effort and
        // must never crash tracker setup, so treat a throw like an unsupported env.
        return false;
      }
    }
    return false;
  };
  const isHubSpotDomain = () => {
    const {
      location
    } = localWindow;
    return typeof location === 'object' && typeof location['hostname'] === 'string' && HUBSPOT_DOMAINS_REGEX.test(location.hostname);
  };

  // Experimental Speculation Rules API
  // https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/prerendering
  const isPrerendering = () => {
    const {
      document
    } = localWindow;
    if (typeof document === 'object' &&
    // @ts-ignore document.prerendering is experimental and only available in Chromium browsers
    typeof document.prerendering === 'boolean') {
      // @ts-ignore document.prerendering is experimental and only available in Chromium browsers
      return document.prerendering;
    }
    return false;
  };
  return {
    hasRaven,
    isDocumentReady,
    addEventListener,
    dispatchWindowEvent,
    isLocalDeployment: !enviro.deployed(),
    isQaDeployment: enviro.isQa(),
    isProdDeployment: enviro.isProd(),
    isDebugEnabled: Boolean(enviro.debug(debugKey)),
    isHubSpotDomain: isHubSpotDomain(),
    hasLocalStorage: hasLocalStorage(),
    hasCookieAccess: hasCookieAccess(),
    hasBeaconSupport: hasBeaconSupport(),
    hasLocationApi: hasLocationApi(),
    isDocumentVisible,
    isPrerendering
  };
};
const {
  hasRaven,
  isDocumentReady,
  addEventListener,
  dispatchWindowEvent,
  hasLocalStorage,
  hasCookieAccess,
  hasBeaconSupport,
  hasLocationApi,
  isLocalDeployment,
  isQaDeployment,
  isProdDeployment,
  isDebugEnabled,
  isDocumentVisible,
  isHubSpotDomain,
  isPrerendering
  // Creates a default Browser Helper using the Window object
} = createBrowserHelper(typeof lWindow !== 'undefined' ? lWindow : undefined);
export { addEventListener, dispatchWindowEvent, hasBeaconSupport, hasCookieAccess, hasLocalStorage, hasLocationApi, hasRaven, isDebugEnabled, isDocumentReady, isDocumentVisible, isHubSpotDomain, isLocalDeployment, isPrerendering, isProdDeployment, isQaDeployment };
export default createBrowserHelper;