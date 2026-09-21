import CartographerReporter, { THIRTY_SECONDS } from './CartographerReporter';
import SoftNavLcpObserver from './SoftNavLcpObserver';
import { isReload } from '../navigation';
import { captureException } from '../ravenUtils';
import { onVisibilityHidden } from '../visibility';
import performanceNow from '../../vendor/performanceNow';
import PerformanceEventBus from '../PerformanceEventBus';
import PageStateTracker from '../PageStateTracker';
import { getElementSelector, getNearestComponentName } from '../elementSelector';
import { isInIframe } from '../browserAccessors';
const DEFERRED_PAINT_THRESHOLD = 10000;
export default class VitalsReporter extends CartographerReporter {
  /**
   * Get the singleton instance of VitalsReporter.
   * Uses window-scoped storage so the instance is shared across all JS bundles
   * on the same page, preventing duplicate LCP reports.
   */
  static getInstance(options) {
    const w = window;
    if (!w[VitalsReporter.WINDOW_KEY]) {
      w[VitalsReporter.WINDOW_KEY] = new VitalsReporter(options);
    }
    return w[VitalsReporter.WINDOW_KEY];
  }
  static resetInstance() {
    window[VitalsReporter.WINDOW_KEY] = undefined;
  }
  getPageState() {
    const pageStateTracker = PageStateTracker.getInstance();
    const pageStateSummary = pageStateTracker.getStateSummary();
    const currentSnapshot = pageStateTracker.getSnapshot();
    return {
      currentOnline: currentSnapshot.online,
      currentHidden: currentSnapshot.hidden,
      wasEverHidden: pageStateSummary.wasEverHidden,
      wasEverOffline: pageStateSummary.wasEverOffline
    };
  }
  debounce() {
    clearTimeout(this.flushQueueTimeout);
    this.flushQueueTimeout = setTimeout(() => {
      this.flushPerformanceQueue();
      // clear the map once the performance action buffer is cleared, to avoid memory leak
      this.interactionMap.clear();
    }, THIRTY_SECONDS);
  }
  finalizeLCP() {
    try {
      if (this.latestLCP) {
        this.pushPerformanceAction(this.latestLCP.route, 'largest-contentful-paint', Object.assign({}, this.latestLCP.data, {
          status: this.lastStatus,
          failureType: this.lastFailureType,
          isReload: isReload()
        }));
        this.latestLCP = null;
        this.debounce();
      }
    } catch (e) {
      captureException(e instanceof Error ? e : new Error(String(e)));
    }
  }
  flushSoftNavLcp() {
    try {
      const candidate = this.softNavLcpObserver.stop();
      if (candidate) {
        // Attribution depends on the call site:
        //   - Interaction / page-hide: lastRouteInfo is the destination route (set by
        //     ROUTE_SUCCEEDED), which is correct — the observer ran while that route
        //     was displayed.
        //   - ROUTE_STARTED: lastRouteInfo is still the *previous* route (ROUTE_SUCCEEDED
        //     hasn't fired yet), which is also correct — this flushes the LCP measured
        //     while the user was on the route being left.
        this.pushPerformanceAction(this.lastRouteInfo, 'soft-nav-lcp', Object.assign({}, candidate, {
          status: this.lastStatus,
          failureType: this.lastFailureType,
          isEmbedded: isInIframe(),
          pageState: this.getPageState()
        }));
        this.debounce();
      }
    } catch (e) {
      captureException(e instanceof Error ? e : new Error(String(e)));
    }
  }
  armLcpInteractionListeners() {
    this.interactionCleanupFunctions.forEach(cleanup => cleanup());
    this.interactionCleanupFunctions = [];
    const eventTypes = ['keydown', 'mousedown', 'pointerdown', 'touchstart'];
    eventTypes.forEach(eventType => {
      const handler = () => {
        this.finalizeLCP();
        this.flushSoftNavLcp();
        this.interactionCleanupFunctions.forEach(cleanup => cleanup());
      };
      window.addEventListener(eventType, handler, {
        capture: true,
        once: true
      });
      this.interactionCleanupFunctions.push(() => window.removeEventListener(eventType, handler, {
        capture: true
      }));
    });
  }
  constructor(options) {
    super(options);
    this.stopped = false;
    this.firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity;
    this.interactionMap = new Map();
    this.latestLCP = null;
    this.lastStatus = undefined;
    this.lastFailureType = undefined;
    this.navStartTime = 0;
    this.interactionCleanupFunctions = [];
    this.softNavLcpObserver = new SoftNavLcpObserver(getElementSelector, getNearestComponentName);
    window.addEventListener('visibilitychange', event => {
      this.firstHiddenTime = Math.min(this.firstHiddenTime, event.timeStamp);
    }, {
      once: true
    });
    const processUserInteractionEntry = perfEntry => {
      try {
        const {
          interactionId,
          target,
          name
        } = perfEntry;
        if (interactionId > 0) {
          // When a tab goes to the background between an interaction and the
          // next paint, the browser defers the paint until the tab is visible
          // again — inflating `duration` to include the entire hidden period
          // (we've seen values in the billions of ms). Filter these out by
          // comparing duration to the actual processing time.
          const processingTime = perfEntry.processingEnd - perfEntry.startTime;
          if (perfEntry.duration - processingTime > DEFERRED_PAINT_THRESHOLD) {
            return;
          }
          let interaction = this.interactionMap.get(interactionId);
          if (!interaction) {
            interaction = {
              latency: 0,
              entries: [],
              interactionNames: ''
            };
            this.interactionMap.set(interactionId, interaction);
          }
          interaction.entries.push(perfEntry);
          interaction.latency = Math.max(perfEntry.duration, interaction.latency);
          const testId = target && target !== null && target !== void 0 && target.hasAttribute('data-test-id') ? target === null || target === void 0 ? void 0 : target.getAttribute('data-test-id') : '';
          const tagName = getElementSelector(target);
          if (name && name.length > 0) {
            interaction.interactionNames = interaction.interactionNames.concat(interaction.interactionNames.length > 0 ? ' ' : '', name);
          }
          this.evictPerformanceAction(interactionId);
          this.pushPerformanceAction(this.lastRouteInfo, 'event', {
            interactionId,
            interactionNames: interaction.interactionNames,
            latency: interaction.latency,
            elapsedMs: performanceNow(),
            testId,
            tagName,
            pageState: this.getPageState()
          });
          this.debounce();
        }
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    };
    PerformanceEventBus.getInstance().subscribe('long-animation-frame', perfEntry => {
      try {
        // For each script in the long animation frame, emit a longtask event
        // Only log scripts with duration >= 50ms
        perfEntry.scripts.forEach(script => {
          if (script.duration >= 50) {
            const scriptData = script.toJSON();
            this.pushPerformanceAction(this.lastRouteInfo, 'longtask', Object.assign({
              name: script.windowAttribution
            }, scriptData, {
              entryType: 'longtask',
              pageState: this.getPageState()
            }));
          }
        });
        this.debounce();
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    });
    PerformanceEventBus.getInstance().subscribe('event', perfEntry => {
      processUserInteractionEntry(perfEntry);
    });
    PerformanceEventBus.getInstance().subscribe('largest-contentful-paint', perfEntry => {
      try {
        const element = perfEntry.element;
        const {
          entryType,
          size,
          startTime,
          renderTime,
          loadTime,
          id,
          url
        } = perfEntry.toJSON();
        if (startTime >= this.firstHiddenTime || startTime < this.navStartTime) {
          return;
        }
        const paintData = {
          entryType,
          size,
          startTime,
          renderTime,
          element: getElementSelector(element !== null && element !== void 0 ? element : null),
          loadTime,
          elapsedMs: performanceNow(),
          id,
          url,
          pageState: this.getPageState()
        };
        // Store the latest LCP instead of pushing immediately
        // It will be pushed when the page becomes hidden or user interacts
        this.latestLCP = {
          route: this.lastRouteInfo,
          data: paintData
        };
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    });
    this.armLcpInteractionListeners();

    // Handle visibility change to flush remaining entries
    onVisibilityHidden(() => {
      try {
        this.finalizeLCP();
        this.flushSoftNavLcp();
        // Clean up interaction listeners since LCP is now finalized
        this.interactionCleanupFunctions.forEach(cleanup => cleanup());
        // Flush any remaining performance actions
        this.flushPerformanceQueue();
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    });
  }
  destroy() {
    // VitalsReporter is a singleton shared across all RhumbProvider instances;
    // its listeners must persist for the page lifetime.
  }
  evictPerformanceAction(interactionId) {
    this.performanceActions = this.performanceActions.filter(action => action.data.interactionId !== interactionId);
  }
  __setFirstHiddenTime(time) {
    this.firstHiddenTime = time;
  }
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.isResolved(action.payload.entry.id) || this.stopped) {
      return;
    }
    switch (action.type) {
      case 'ROUTE_STARTED':
        {
          this.navStartTime = action.payload.entry.timestamp;
          // Flush browser LCP for the route being left (initial page load case)
          this.finalizeLCP();
          // Flush any soft-nav LCP accumulated for the route being left
          this.flushSoftNavLcp();
          // Start custom observer only for genuine soft navs (lastRouteInfo set = a route
          // has already resolved, so this is not the initial page load)
          if (this.lastRouteInfo) {
            this.softNavLcpObserver.start(this.navStartTime);
          }
          this.armLcpInteractionListeners();
          break;
        }
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const {
            routeSpec
          } = action.payload;
          if (routeSpec) {
            this.lastRouteInfo = {
              route: routeSpec.route
            };
          }
          this.lastStatus = 'failure';
          this.lastFailureType = 'watchdogExpired';
          break;
        }
      case 'GLOBAL_ERROR':
      case 'ROUTE_FAILED':
        {
          const {
            entry: {
              pathname
            },
            routeSpec
          } = action.payload;
          if (routeSpec) {
            this.lastRouteInfo = {
              pathname,
              route: routeSpec.route
            };
          }
          this.lastStatus = 'failure';
          this.lastFailureType = action.type === 'ROUTE_FAILED' ? 'errorSelector' : undefined;
          break;
        }
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          const {
            entry: {
              pathname
            },
            extra: {
              scenario
            },
            routeSpec
          } = action.payload;
          const {
            route
          } = routeSpec;
          this.lastRouteInfo = {
            pathname,
            route,
            scenario
          };
          this.lastStatus = 'partial_success';
          this.lastFailureType = undefined;
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          const {
            entry: {
              pathname
            },
            extra: {
              scenario
            },
            routeSpec
          } = action.payload;
          const {
            route
          } = routeSpec;
          this.lastRouteInfo = {
            pathname,
            route,
            scenario
          };
          this.lastStatus = 'success';
          this.lastFailureType = undefined;
          break;
        }
      default:
    }
    switch (action.type) {
      case 'ROUTE_UNEXPECTED':
        {
          this.stopped = true;
          break;
        }
      case 'GLOBAL_ERROR':
      case 'ROUTE_PARTIAL_SUCCESS':
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          this.markResolved(action.payload.entry.id);
          break;
        }
      default:
    }
  }
}
VitalsReporter.WINDOW_KEY = '__rhumb_vitals_reporter__';