// @ts-ignore Untyped import
import { eventProps } from '../selectors/eventProps';
import { getIsPrivateLoad } from '../../widget-data/selectors/getIsPrivateLoad';
import { getUsageTracker } from '../usageTracker';
// @ts-ignore Untyped import
import { getIsUserTrackingAllowed } from '../../gdpr/selectors/getIsUserTrackingAllowed';
import { EVENT_NAMESPACE, EVENT_NAME_TO_KEY_MAPPING, EVENT_NAMES } from '../constants/eventNames';
let trackOnce = false;
const trackOnceSet = new Set();
export function trackInteraction(eventName, properties = {}, flag = false, trackOnceFlag = false, eventKey) {
  return (_dispatch, getState) => {
    const tracker = getUsageTracker();
    const isPrivateLoad = getIsPrivateLoad(getState());
    const isUserTrackingAllowed = getIsUserTrackingAllowed(getState());
    if (trackOnceFlag && trackOnceSet.has(eventName)) {
      return;
    } else if (trackOnceFlag) {
      trackOnceSet.add(eventName);
    }
    if (isUserTrackingAllowed && !trackOnce) {
      let key = eventKey;
      if (!key) {
        key = EVENT_NAME_TO_KEY_MAPPING[eventName];
      }
      const trackingProperties = Object.assign({}, eventProps(getState()), properties, {
        privateLoad: isPrivateLoad
      }, key && {
        key
      });
      tracker.track(EVENT_NAMESPACE, eventName, trackingProperties);
      trackOnce = flag;
    }
  };
}