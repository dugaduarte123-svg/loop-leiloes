import { createMetricsFactory } from 'metrics-js';

// Metrics factory for i18n library.
export const Metrics = createMetricsFactory('I18n', {
  library: 'I18n'
});