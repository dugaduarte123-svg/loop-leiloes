import CartographerReporter, { THIRTY_SECONDS } from './CartographerReporter';
import { getRelativeMarkerTimings } from '../markerUtils';
import { visibilityState } from '../visibility';
import { PageLoadMetrics } from '../Metrics';
import { getIsAiCopilotEnabled } from '../aiCopilot';
export default class InAppReporter extends CartographerReporter {
  constructor(options) {
    super(options);
    this.stopped = false;
    this.flushQueueTimeout = undefined;
    this.currentActionStartTimestamp = null;
    this.previousNavigationAction = null;
    this.initVisibilityTracking();
  }
  pushInAppNavigationAction(routeInfo, status, wasHidden, isHidden, duration, timestamp, markers) {
    if (this.previousNavigationAction) {
      this.pushNavigationAction({
        to: routeInfo,
        from: this.previousNavigationAction,
        status,
        wasHidden,
        isHidden,
        duration,
        timestamp,
        markers
      });
    }
    this.previousNavigationAction = routeInfo;
  }
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.isResolved(action.payload.entry.id) || this.stopped) {
      return;
    }
    const isAiCopilotEnabled = String(getIsAiCopilotEnabled());
    switch (action.type) {
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          const {
            entry,
            routeSpec
          } = action.payload;
          const {
            pathname,
            checks,
            expiredTimestamp
          } = entry;
          const {
            route,
            error
          } = routeSpec;
          if (!this.wasHidden && this.previousNavigationAction) {
            if (action.type === 'ROUTE_FAILED') {
              PageLoadMetrics.counter('transition-failed', this.buildMetricsDimensions(route, isAiCopilotEnabled)).increment();
            } else {
              PageLoadMetrics.counter('transition-timeouts', this.buildMetricsDimensions(route, isAiCopilotEnabled)).increment();
            }
          }
          const {
            duration,
            timestamp
          } = action.type === 'ROUTE_FAILED' ? this.toTimings(checks, this.currentActionStartTimestamp, error) : {
            duration: expiredTimestamp - this.currentActionStartTimestamp,
            timestamp: expiredTimestamp
          };
          const markerTimings = getRelativeMarkerTimings(checks, this.currentActionStartTimestamp);
          this.pushInAppNavigationAction({
            pathname,
            route,
            scenario: action.type === 'ROUTE_FAILED' && error ? error.join(',') : action.type
          }, 'failure', this.wasHidden, visibilityState() === 'hidden', duration, timestamp, markerTimings);
          break;
        }
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          const {
            entry,
            routeSpec,
            extra
          } = action.payload;
          const {
            pathname,
            checks
          } = entry;
          const {
            route
          } = routeSpec;
          const {
            scenario
          } = extra;
          const markers = routeSpec.partialSuccess[scenario] || [];
          const {
            duration,
            timestamp
          } = this.toTimings(checks, this.currentActionStartTimestamp, markers);
          if (!this.wasHidden && this.previousNavigationAction) {
            PageLoadMetrics.timer('transition-succeeded', this.buildMetricsDimensions(route, isAiCopilotEnabled, {
              scenario
            })).update(duration);
            PageLoadMetrics.timer('transition-partial-success', this.buildMetricsDimensions(route, isAiCopilotEnabled, {
              scenario
            })).update(duration);
          }
          const markerTimings = getRelativeMarkerTimings(checks, this.currentActionStartTimestamp);
          this.pushInAppNavigationAction({
            pathname,
            route,
            scenario: scenario || markers.join(',')
          }, 'partial_success', this.wasHidden, visibilityState() === 'hidden', duration, timestamp, markerTimings);
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          const {
            entry,
            routeSpec,
            extra
          } = action.payload;
          const {
            pathname,
            checks
          } = entry;
          const {
            route
          } = routeSpec;
          const {
            scenario
          } = extra;
          const markers = routeSpec.success[scenario] || '';
          const {
            duration,
            timestamp
          } = this.toTimings(checks, this.currentActionStartTimestamp, markers);
          if (!this.wasHidden && this.previousNavigationAction) {
            PageLoadMetrics.timer('transition-succeeded', this.buildMetricsDimensions(route, isAiCopilotEnabled, {
              scenario
            })).update(duration);
          }
          const markerTimings = getRelativeMarkerTimings(checks, this.currentActionStartTimestamp);
          this.pushInAppNavigationAction({
            pathname,
            route,
            scenario: scenario || markers.join(',')
          }, 'success', this.wasHidden, visibilityState() === 'hidden', duration, timestamp, markerTimings);
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
      case 'ROUTE_STARTED':
        {
          const {
            entry
          } = action.payload;
          const {
            timestamp
          } = entry;
          this.currentActionStartTimestamp = this.currentActionStartTimestamp || timestamp;
          break;
        }
      case 'ROUTE_ABANDONED':
        {
          this.currentActionStartTimestamp = null;
          break;
        }
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_PARTIAL_SUCCESS':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_FAILED':
        {
          this.currentActionStartTimestamp = null;
          this.markResolved(action.payload.entry.id);
          clearTimeout(this.flushQueueTimeout);
          this.flushQueueTimeout = setTimeout(() => {
            this.flushNavigationQueue();
          }, THIRTY_SECONDS);
          break;
        }
      default:
    }
  }
}