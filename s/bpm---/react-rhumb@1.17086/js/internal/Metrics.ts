import { createMetricsFactory } from 'metrics-js';
import { isAcceptanceTest, isPrerendering } from './env';

// Use different metric names when running in acceptance tests
const metricsSuffix = isAcceptanceTest() ? '-acceptance-tests' : '';
export const PageLoadMetrics = createMetricsFactory(
// Only page load metrics have a separate metric name when running in prerendering mode
`page-load${isPrerendering() ? '-prerendering' : metricsSuffix}`, {
  library: 'react-rhumb'
});
export const ReduxStoreSizeMetrics = createMetricsFactory(`redux-store-metrics${metricsSuffix}`, {
  library: 'react-rhumb'
});
export const MemoryMetrics = createMetricsFactory(`application-memory${metricsSuffix}`, {
  library: 'react-rhumb'
});
export const GlobalErrorMetrics = createMetricsFactory(`global-error${metricsSuffix}`, {
  library: 'react-rhumb'
});
export const GraniteHealthMetrics = createMetricsFactory(`granite-health${metricsSuffix}`, {
  library: 'react-rhumb'
});