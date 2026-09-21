import { getFullUrl } from 'hubspot-url-utils';
import memoizeOne from 'react-utils/memoizeOne';
import PortalIdParser from 'PortalIdParser';
import BaseReporter, { Color } from './BaseReporter';
import { isAcceptanceTest, isPrerendering } from '../env';
import { getSessionId } from '../browserAccessors';
import { redactUrl } from '../redactUrl';
export const THIRTY_SECONDS = 1000 * 30;
export const CartographerEndpoint = {
  Navigation: 'rhumb',
  Performance: 'performance'
};
const formatVersion = version => {
  if (!version) {
    return 'unknown';
  }
  if (version === 'static') {
    return 'dev';
  }
  return version.replace('static-', '');
};
const getMetricsEndpoint = memoizeOne((endpoint, staticAppName, staticAppVersion) => {
  return `${getFullUrl('app-api')}/cartographer/v1/${endpoint}?hs_static_app=${staticAppName}&hs_static_app_version=${formatVersion(staticAppVersion)}`;
});
export default class CartographerReporter extends BaseReporter {
  constructor(options) {
    var _options$userId;
    super(options);
    this.performanceActions = [];
    this.navigationActions = [];
    this.userId = (_options$userId = options === null || options === void 0 ? void 0 : options.userId) !== null && _options$userId !== void 0 ? _options$userId : null;
    this.initialUrl = redactUrl(window.location.href);
    if (isAcceptanceTest()) {
      // sessionStorage persists through same-origin reload, bridging the unload→reload boundary.
      // Chrome 149 drops CDP console events from unloading contexts, so we signal via DOM instead.
      if (sessionStorage.getItem('cartographer-flushed')) {
        sessionStorage.removeItem('cartographer-flushed');
        document.documentElement.setAttribute('data-cartographer-flushed', 'true');
      }
    }
    this._visibilityChangeHandler = () => {
      // Last reliable observable state, @see { https://developer.chrome.com/blog/page-lifecycle-api/#advice-hidden }
      if (document.visibilityState === 'hidden') {
        if (isAcceptanceTest()) {
          sessionStorage.setItem('cartographer-flushed', 'true');
        }
        this.flushAllQueues();
      }
    };
    this._pagehideHandler = () => {
      if (isAcceptanceTest()) {
        console.log('flushing all cartographer actions');
      }
      this.flushAllQueues();
    };
    window.addEventListener('visibilitychange', this._visibilityChangeHandler, false);
    window.addEventListener('pagehide', this._pagehideHandler, false);
  }
  destroy() {
    window.removeEventListener('visibilitychange', this._visibilityChangeHandler, false);
    window.removeEventListener('pagehide', this._pagehideHandler, false);
  }
  updateUserId(userId) {
    this.userId = userId;
  }
  sendActions(actions, endpoint) {
    try {
      // eslint-disable-next-line compat/compat
      return navigator.sendBeacon(getMetricsEndpoint(endpoint, this.staticAppName, this.staticAppVersion), JSON.stringify({
        userAgent: navigator.userAgent,
        portalId: PortalIdParser.get({
          preserveGlobalId: true
        }),
        sessionId: getSessionId(),
        userId: this.userId,
        isAcceptanceTest: isAcceptanceTest(),
        isPrerendering: isPrerendering(),
        datapoints: actions
      }));
    } catch (_unused) {
      return null;
    }
  }
  logActions(actions) {
    if (!this.debug) {
      return;
    }
    this.logGroupWithBadge('Cartographer beacon', Color.KOALA, Color.SLINKY, () => {
      actions.forEach(console.log);
    });
  }
  flushNavigationQueue() {
    if (!this.navigationActions.length) {
      return;
    }
    try {
      const sent = this.sendActions(this.navigationActions, CartographerEndpoint.Navigation);
      if (sent) {
        this.logActions(this.navigationActions);
        this.navigationActions = [];
      }
    } catch (e) {
      // Do nothing
    }
  }
  flushPerformanceQueue() {
    if (!this.performanceActions.length) {
      return;
    }
    try {
      const sent = this.sendActions(this.performanceActions, CartographerEndpoint.Performance);
      if (sent) {
        this.logActions(this.performanceActions);
        this.performanceActions = [];
      }
    } catch (e) {
      // Do nothing
    }
  }
  flushAllQueues() {
    this.flushNavigationQueue();
    this.flushPerformanceQueue();
  }
  pushNavigationAction(navigationAction) {
    this.navigationActions.push(navigationAction);
  }
  pushPerformanceAction(route, type, data) {
    this.performanceActions.push({
      route,
      type,
      data
    });
  }
}