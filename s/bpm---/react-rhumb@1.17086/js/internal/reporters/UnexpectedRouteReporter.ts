import { capturePageEvent } from '../ravenUtils';
import BaseReporter from './BaseReporter';
import { PageLoadMetrics } from '../Metrics';
import { redactEmailsFromPathname } from '../redactUrl';
export default class UnexpectedRouteReporter extends BaseReporter {
  constructor() {
    super();
    this.notifiedRoutes = new Set();
  }
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.isResolved(action.payload.entry.id) && action.type !== 'CHECKS_CHANGED') {
      return;
    }
    if (action.type === 'ROUTE_UNEXPECTED') {
      const pathname = redactEmailsFromPathname(action.payload.entry.pathname);
      if (!this.notifiedRoutes.has(pathname)) {
        capturePageEvent('react-rhumb-event', {
          extra: {
            eventName: 'UnexpectedRouteVisited',
            pathname
          }
        });
        this.captureUnexpectedRoute(pathname);
        this.notifiedRoutes.add(pathname);
        PageLoadMetrics.counter('unexpected-route').increment();
      }
      this.markResolved(action.payload.entry.id);
    }
  }
}