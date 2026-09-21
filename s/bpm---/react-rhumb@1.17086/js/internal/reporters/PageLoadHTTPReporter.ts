import BaseReporter from './BaseReporter';
import { getHubHttpData } from '../httpRequestsStats';
import { getJSChunkData } from '../jsChunkStats';
import { PageLoadMetrics } from '../Metrics';
const METRIC_NAME_MAP = new Map([['numSucceededRequests', 'succeeded-requests'], ['numAbortedRequests', 'aborted-requests'], ['numPendingRequests', 'pending-requests'], ['numNotFound', 'not-found-requests'], ['numTimedoutRequests', 'timed-out-requests'], ['numFailedRequestsMinus404AndRetries', 'failed-requests'], ['numRetriedFailures', 'retried-requests']]);
const JS_CHUNK_METRIC_NAME_MAP = new Map([['numJSChunksLoaded', 'js-chunks-loaded'], ['numJSChunksCached', 'js-chunks-cached'], ['numJSChunksUncached', 'js-chunks-uncached']]);
const REQUEST_SUBTYPES = ['graphql', 'chirp', 'rest'];
export default class PageLoadHTTPReporter extends BaseReporter {
  constructor(options) {
    super(options);
    this.finished = false;
    this.initVisibilityTracking();
  }
  sendMetrics(timestamp, dimensions = {}) {
    if (!this.wasHidden) {
      const stats = getHubHttpData(timestamp);
      if (stats) {
        METRIC_NAME_MAP.forEach((metricName, statName) => {
          const value = Number(stats[statName]);
          PageLoadMetrics.histogram(metricName, dimensions).update(value);
        });
        REQUEST_SUBTYPES.forEach(requestType => {
          const typeStats = stats.byRequestType[requestType];
          METRIC_NAME_MAP.forEach((metricName, statKey) => {
            const value = Number(typeStats[statKey]);
            PageLoadMetrics.histogram(metricName, Object.assign({}, dimensions, {
              requestType
            })).update(value);
          });
        });
      }
    }
    const jsChunkStats = getJSChunkData(timestamp);
    if (jsChunkStats) {
      JS_CHUNK_METRIC_NAME_MAP.forEach((metricName, statName) => {
        const value = Number(jsChunkStats[statName]);
        PageLoadMetrics.histogram(metricName, dimensions).update(value);
      });
    }
  }
  report(action) {
    if (action.type === 'COMPONENT_RENDERED' || this.finished) {
      return;
    }
    const {
      entry: {
        checks,
        expiredTimestamp
      },
      routeSpec
    } = action.payload;
    switch (action.type) {
      case 'ROUTE_SUCCEEDED':
      case 'ROUTE_PARTIAL_SUCCESS':
      case 'ROUTE_FAILED':
      case 'ROUTE_TIMEOUT_EXPIRED':
      case 'ROUTE_UNEXPECTED':
        {
          this.finished = true;
          break;
        }
      default:
    }
    switch (action.type) {
      case 'ROUTE_PARTIAL_SUCCESS':
        {
          const {
            partialSuccess
          } = routeSpec;
          const {
            extra: {
              scenario
            }
          } = action.payload;
          const {
            timestamp
          } = this.toTimings(checks, 0, partialSuccess[scenario]);
          this.sendMetrics(timestamp, {
            scenario,
            status: 'partial_success'
          });
          break;
        }
      case 'ROUTE_SUCCEEDED':
        {
          const {
            success
          } = routeSpec;
          const {
            extra: {
              scenario
            }
          } = action.payload;
          const {
            timestamp
          } = this.toTimings(checks, 0, success[scenario]);
          this.sendMetrics(timestamp, {
            scenario,
            status: 'success'
          });
          break;
        }
      case 'ROUTE_FAILED':
        {
          const {
            error
          } = routeSpec;
          const markers = error.filter(marker => checks[marker]);
          const [failedMarker] = markers;
          const finishedTimestamp = checks[failedMarker].timestamp;
          this.sendMetrics(finishedTimestamp, {
            selector: failedMarker,
            status: 'failure'
          });
          break;
        }
      case 'ROUTE_TIMEOUT_EXPIRED':
        {
          if (expiredTimestamp) {
            this.sendMetrics(expiredTimestamp, {
              status: 'failure'
            });
          }
          break;
        }
      default:
    }
  }
}