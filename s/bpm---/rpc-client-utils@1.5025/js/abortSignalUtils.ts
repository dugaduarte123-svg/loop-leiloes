/**
 * Creates a combined abort signal that incorporates both a timeout and optional user-provided abort signal
 *
 * @param timeoutMs Timeout in milliseconds
 * @param userSignal Optional user-provided AbortSignal
 * @returns Combined AbortSignal that aborts when either the timeout occurs or the user signal aborts
 */
export function createCombinedAbortSignal(timeoutMs, userSignal) {
  // Safari 11 compatibility - create a polyfill for AbortSignal.timeout if it doesn't exist
  const createTimeoutSignal = ms => {
    if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
      // If the browser supports AbortSignal.timeout, use it
      return AbortSignal.timeout(ms);
    } else {
      // Otherwise create our own implementation
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    }
  };
  if (userSignal) {
    // If we have both a timeout and user signal, create a controller that aborts when either aborts
    const timeoutSignal = createTimeoutSignal(timeoutMs);

    // Check if either signal is already aborted
    if (userSignal.aborted || timeoutSignal.aborted) {
      throw new Error('Request aborted');
    }

    // Create a controller for the combined signal
    const controller = new AbortController();
    const signal = controller.signal;

    // Set up listeners to abort when either source signal aborts
    userSignal.addEventListener('abort', () => controller.abort(), {
      once: true
    });
    timeoutSignal.addEventListener('abort', () => controller.abort(), {
      once: true
    });
    return signal;
  } else {
    // If we only have the timeout, just use that
    return createTimeoutSignal(timeoutMs);
  }
}