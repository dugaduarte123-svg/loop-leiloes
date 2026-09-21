import BaseReporter from './BaseReporter';
export default class ProdConsoleReporter extends BaseReporter {
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.isResolved(action.payload.entry.id) && action.type !== 'CHECKS_CHANGED') {
      return;
    }
    const {
      entry: {
        pathname,
        expiredTimestamp,
        checks,
        id,
        timestamp: totalTimeFromRouteStart
      },
      routeSpec
    } = action.payload;
    if (!this.debug) {
      return;
    }
    const log = (...args) => console.log(`[${this.libName}]`, pathname, ...args);
    const formatDuration = num => `${num.toFixed(2)}ms`;
    const logIfOffset = duration => {
      if (this.options.timingOffset) {
        log(`adjusted: ${formatDuration(duration + this.options.timingOffset)} (offset ${this.options.timingOffset})`);
      }
    };
    switch (action.type) {
      case 'ROUTE_STARTED':
        {
          const {
            route
          } = routeSpec;
          log(`(${route})`);
          break;
        }
      case 'ROUTE_UNEXPECTED':
        {
          log(`(unexpected)`);
          break;
        }
      case 'ROUTE_ABANDONED':
        {
          log(`(abandoned)`);
          break;
        }
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          const {
            scenario
          } = action.payload.extra;
          const duration = this.toReportedDurationMs(checks, totalTimeFromRouteStart, routeSpec.partialSuccess[scenario]);
          log(`(Partial Success) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          const {
            scenario
          } = action.payload.extra;
          const duration = this.toReportedDurationMs(checks, totalTimeFromRouteStart, routeSpec.success[scenario]);
          log(`(success) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }
      case 'ROUTE_FAILED':
        {
          const {
            error
          } = routeSpec;
          const duration = this.toReportedDurationMs(checks, totalTimeFromRouteStart, error);
          log(`(failure) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          const duration = this.computeTimeoutDurationMs(expiredTimestamp, totalTimeFromRouteStart);
          log(`(timeout) ${formatDuration(duration)}`);
          logIfOffset(duration);
          break;
        }
      case 'CHECKS_CHANGED':
        {
          log(`(update)`);
          break;
        }
      default:
    }
    switch (action.type) {
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_UNEXPECTED':
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_PARTIAL_SUCCESS':
      case 'ROUTE_FAILED':
        {
          this.markResolved(id);
          break;
        }
      default:
    }
  }
}