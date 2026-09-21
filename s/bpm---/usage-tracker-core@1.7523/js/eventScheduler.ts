import * as helpers from './common/helpers';
export const createScheduler = (isDocumentReady, isPrerendering, debounceTime = 2000, maxDeferredAttempts = 3) => {
  let deferredInterval = 0;
  let deferredAttempts = 0;

  // This helps us to eagerly detect if the document is ready already by when this scheduler was created
  // And it already kicks-off the fake state if "window" is not present, as the timeout will be triggered
  let _isDocumentReady = isDocumentReady();
  let _isPrerendering = isPrerendering();
  const execute = callback => callback();

  // This waits until the isDocumentReady() returns `true`
  // The interval will keep running until the document is ready
  // If the interval gets executed for X amount of times without the document being ready
  // It will exhaust the interval and will then execute the callback anyway
  // It is important to mention that the intervals do not stack up as it will be executed only once
  const deferredExecution = callback => {
    if (deferredInterval) {
      return;
    }
    deferredInterval = setInterval(() => {
      // The deferred execution interval attempts to check for X times if the document is ready
      // On an interval of Y seconds, meaning if the first check failed, it will attempt more X - 1 attempts
      // To give a total of X * Y seconds of waiting time. The document might not have been initialised by then
      // But usually this happens for meterred connections or very slow devices.
      const hasExhaustedAttempts = deferredAttempts >= maxDeferredAttempts;

      // We assing it to a variable so that we don't need to call the function again
      // Every time that `scheduleFlush` is called. We also set it to true
      // If by any chance we exhausted the maximum amount of attempts
      _isDocumentReady = isDocumentReady() || hasExhaustedAttempts;

      // Only track user events if the user has activated the page
      // document.prerender = true means the page is not activated
      _isPrerendering = isPrerendering();
      if (_isDocumentReady && !_isPrerendering) {
        clearInterval(deferredInterval);
        execute(callback);

        // Cleans up the interval and attempts after the execution
        // To avoid spill over if by any chance the
        // isDocumentReady transitions from "true" to "false"
        deferredInterval = 0;
        deferredAttempts = 0;
        return;
      }
      deferredAttempts += 1;
    }, debounceTime);
  };
  const debouncedExecution = helpers.debounce(execute, debounceTime);

  // If the document is ready we do a debounced execution which means from every time
  // the method gets called, only one of the calls will get called after the debounceTime
  // If the document is not ready it will do a deferred execution which means the first call
  // Will get called once the document is ready or the maxDeferredAttempts is reached
  //
  // document.prerender is part of Speculation Rules. isPrerendering=true means the page is not activated
  // by the user therefore no user events should be tracked.
  const scheduleFlush = callback => {
    if (_isDocumentReady && !_isPrerendering) {
      return debouncedExecution(callback);
    }
    return deferredExecution(callback);
  };
  return {
    scheduleFlush
  };
};