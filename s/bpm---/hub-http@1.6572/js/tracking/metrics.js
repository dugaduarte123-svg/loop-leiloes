'use es6';

import {
    createMetricsFactory
} from 'metrics-js';
export const Metrics = createMetricsFactory('http', {
    library: 'hub-http'
});