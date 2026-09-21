export const accountId = 53;
export const debugKey = 'USAGE_TRACKER_JS';
export const hstcKey = '__hstc';
export const utkKey = 'hubspotutk';
export const hamplitudeKey = '__hmpl';

// This is a storage key defined by 53.js's (#web-analytics)
// and it is stored within the Browser's Window
export const anonymousUtkKey = '__hsUserToken';

/** @deprecated this is here for legacy compatibility */
export const recorderEnabled = 'USAGE_TRACKER_JS_RECORDER_ENABLED';

/** @deprecated this is here for legacy compatibility */
export const recordedEvents = 'USAGE_TRACKER_JS_RECORDED_EVENTS';

/** @deprecated this is here for legacy compatibility */
export const recordedEventKeys = 'USAGE_TRACKER_JS_RECORDED_EVENT_KEYS';

// This is a 2nd guard-rail storage for Events that are dispatched
// and not handled by the `beforeunload` event
export const safeGuardKey = 'HUBLYTICS_EVENTS_53';