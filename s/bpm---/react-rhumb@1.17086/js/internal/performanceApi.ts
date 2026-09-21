/**
 * Type guard to check if a performance entry is of a specific type
 */
export function isPerformanceEntryOfType(entry, type) {
  return entry.entryType === type;
}

/**
 * Check if a performance entry type is supported by the browser
 */
export function isPerformanceEntryTypeSupported(type) {
  // We need to ignore compat/compat here as we're checking for support
  /* eslint-disable compat/compat */
  return typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes(type);
  /* eslint-enable compat/compat */
}