import BaseReporter from './BaseReporter';
export default class PerformanceReporter extends BaseReporter {
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || !this) {
      return;
    }
    const {
      entry,
      routeSpec
    } = action.payload;
    const markOptions = {
      detail: {
        pathname: entry.pathname,
        route: routeSpec === null || routeSpec === void 0 ? void 0 : routeSpec.route
      }
    };
    switch (action.type) {
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          this.performanceMark('route_partial_success', markOptions);
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          this.performanceMark('route_success', markOptions);
          break;
        }
      case 'ROUTE_FAILED':
        {
          this.performanceMark('route_failure', markOptions);
          break;
        }
      case 'ROUTE_UNEXPECTED':
        {
          this.performanceMark('route_unexpected', markOptions);
          break;
        }
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          this.performanceMark('route_timeout', markOptions);
          break;
        }
      default:
    }
  }
}