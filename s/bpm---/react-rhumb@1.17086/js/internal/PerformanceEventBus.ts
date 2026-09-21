import { onVisibilityHidden } from './visibility';
import { isPerformanceEntryTypeSupported } from './performanceApi';
import { captureException } from './ravenUtils';
function isValidPerformanceEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return false;
  }
  if (typeof entry.entryType !== 'string' || entry.entryType.length === 0) {
    return false;
  }
  if (entry.entryType === 'layout-shift') {
    const layoutShiftEntry = entry;
    if ('sources' in layoutShiftEntry && !Array.isArray(layoutShiftEntry.sources)) {
      captureException(new Error('Layout-shift entry has a non-array sources field'), {
        extra: {
          entryType: entry.entryType,
          entry: JSON.stringify(entry)
        },
        tags: {
          component: 'PerformanceEventBus'
        },
        fingerprint: ['layout-shift-non-array-sources']
      });
      return false;
    }
  }
  return true;
}
/**
 * Central management of Performance API observers.
 * This class provides a singleton instance that manages all Performance API observers
 * and routes performance entries to registered callbacks.
 */
class PerformanceEventBus {
  constructor() {
    this.observers = new Map();
    this.callbacks = new Map();
    this.bufferedEntries = new Map();
  } // Private constructor to enforce singleton pattern

  /**
   * Get the singleton instance of PerformanceEventBus.
   * Uses window-scoped storage so the instance is shared across all JS bundles
   * on the same page, preventing duplicate PerformanceObservers.
   */
  static getInstance() {
    const w = window;
    if (!w[PerformanceEventBus.WINDOW_KEY]) {
      w[PerformanceEventBus.WINDOW_KEY] = new PerformanceEventBus();
    }
    return w[PerformanceEventBus.WINDOW_KEY];
  }

  /**
   * Subscribe to performance entries of a specific type
   * Returns a function that can be called to unsubscribe
   */
  subscribe(type, callback) {
    // Check if the entry type is supported by the browser
    if (!isPerformanceEntryTypeSupported(type)) {
      return () => {}; // Return no-op unsubscribe function if type is not supported
    }

    // Initialize callback set if needed
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, new Set());
    }
    const callbackSet = this.callbacks.get(type);
    // Type assertion needed since we store the general type but know this specific callback matches
    callbackSet.add(callback);

    // Create observer if this is the first callback for this type
    if (callbackSet.size === 1) {
      this.createObserver(type);
    } else if (this.bufferedEntries.has(type)) {
      // Send buffered entries to the new callback
      const entries = this.bufferedEntries.get(type);
      entries.forEach(entry => {
        if (entry.entryType === type && isValidPerformanceEntry(entry)) {
          // Type assertion is safe because we've verified the entry type matches
          callback(entry);
        }
      });
    }

    // Return unsubscribe function
    return () => {
      const set = this.callbacks.get(type);
      if (set) {
        set.delete(callback);

        // Clean up observer if no more callbacks for this type
        if (set.size === 0) {
          this.removeObserver(type);
        }
      }
    };
  }

  /**
   * Get a list of all active performance entry types being observed
   */
  getActiveObserverTypes() {
    return Array.from(this.observers.keys());
  }

  /**
   * Reset the entire event bus
   * Useful for testing or when the application needs to be reset
   */
  reset() {
    // Disconnect all observers
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        // Ignore errors during disconnection
      }
    });
    this.observers.clear();
    this.callbacks.clear();
    this.bufferedEntries.clear();
    window[PerformanceEventBus.WINDOW_KEY] = undefined;
  }

  /**
   * Create a performance observer for a specific entry type
   */
  createObserver(type) {
    if (this.observers.has(type)) {
      return; // Observer already exists
    }
    try {
      // Create observer
      // eslint-disable-next-line compat/compat
      const observer = new PerformanceObserver(entries => {
        const entriesList = entries.getEntries();
        const validEntries = entriesList.filter(entry => isValidPerformanceEntry(entry));

        // Store entries in buffer
        if (!this.bufferedEntries.has(type)) {
          this.bufferedEntries.set(type, []);
        }
        const buffer = this.bufferedEntries.get(type);
        validEntries.forEach(entry => buffer.push(entry));

        // Cap buffer size to avoid memory leaks
        if (buffer.length > 100) {
          buffer.splice(0, buffer.length - 100);
        }

        // Dispatch entries to callbacks
        const callbacks = this.callbacks.get(type);
        if (callbacks) {
          validEntries.forEach(entry => {
            if (entry.entryType === type) {
              callbacks.forEach(callback => {
                try {
                  callback(entry);
                } catch (e) {
                  captureException(new Error('Performance callback failed', {
                    cause: e
                  }), {
                    extra: {
                      entryType: type,
                      entry: entry.toJSON(),
                      callbackName: callback.name || 'anonymous',
                      cause: e
                    },
                    tags: {
                      component: 'PerformanceEventBus',
                      callbackType: 'observer',
                      performanceType: type
                    },
                    fingerprint: ['performance-callback-error', type]
                  });
                }
              });
            }
          });
        }
      });

      // Start observing
      const observerOptions = {
        type,
        buffered: true
      };
      if (type === 'event') {
        observerOptions.durationThreshold = 16;
      }

      // Older browsers (e.g. Chrome 73) support PerformanceObserver but only the
      // legacy entryTypes API, not the newer type+buffered form. Fall back to
      // entryTypes if the modern call throws — we lose buffered entries but
      // observation still works. If both calls fail, re-throw with the original
      // error as cause so the outer catch can report it with full context.
      try {
        observer.observe(observerOptions);
      } catch (modernErr) {
        try {
          observer.observe({
            entryTypes: [type]
          });
        } catch (_unused) {
          throw new Error('PerformanceObserver.observe failed with both modern and legacy API', {
            cause: modernErr
          });
        }
      }
      this.observers.set(type, observer);

      // Handle page visibility change
      onVisibilityHidden(() => {
        const currentObserver = this.observers.get(type);
        if (!currentObserver || typeof currentObserver.takeRecords !== 'function') return;
        const visibleEntries = currentObserver.takeRecords();

        // Dispatch any remaining entries
        const callbacks = this.callbacks.get(type);
        if (callbacks) {
          visibleEntries.forEach(entry => {
            // Only dispatch entries that match the callback's type and have valid data
            if (entry.entryType === type && isValidPerformanceEntry(entry)) {
              callbacks.forEach(callback => {
                try {
                  callback(entry);
                } catch (e) {
                  captureException(new Error('Performance callback failed on visibility change', {
                    cause: e
                  }), {
                    extra: {
                      entryType: type,
                      entry: entry.toJSON(),
                      callbackName: callback.name || 'anonymous',
                      visibilityState: 'hidden',
                      cause: e
                    },
                    tags: {
                      component: 'PerformanceEventBus',
                      callbackType: 'visibility',
                      performanceType: type
                    },
                    fingerprint: ['performance-callback-error', type, 'visibility']
                  });
                }
              });
            }
          });
        }

        // Don't disconnect here - we want to keep observers running in background
      });
    } catch (e) {
      captureException(new Error('Failed to create PerformanceObserver', {
        cause: e
      }), {
        extra: {
          entryType: type,
          cause: e
        },
        tags: {
          component: 'PerformanceEventBus',
          callbackType: 'observer_creation',
          performanceType: type
        },
        fingerprint: ['performance-observer-creation-error', type]
      });
    }
  }

  /**
   * Remove an observer for a specific entry type
   */
  removeObserver(type) {
    const observer = this.observers.get(type);
    if (observer) {
      try {
        observer.disconnect();
      } catch (e) {
        captureException(new Error('Failed to disconnect PerformanceObserver', {
          cause: e
        }), {
          extra: {
            entryType: type,
            cause: e
          },
          tags: {
            component: 'PerformanceEventBus',
            callbackType: 'observer_cleanup',
            performanceType: type
          },
          fingerprint: ['performance-observer-cleanup-error', type]
        });
      }
      this.observers.delete(type);
      // Keep buffered entries in case we need them again
    }
  }
}
PerformanceEventBus.WINDOW_KEY = '__rhumb_perf_event_bus__';
export default PerformanceEventBus;