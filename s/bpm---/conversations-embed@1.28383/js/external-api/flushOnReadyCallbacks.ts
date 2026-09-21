import { ON_READY_CALLBACKS } from './constants';
export function flushOnReadyCallbacks(_ref) {
  let {
    logger,
    trackCallback
  } = _ref;
  const callbacks = window[ON_READY_CALLBACKS];
  if (Array.isArray(callbacks)) {
    if (trackCallback) trackCallback();
    callbacks.forEach(cb => {
      try {
        cb();
      } catch (err) {
        if (err instanceof Error) {
          logger.error(err.message);
        }
      }
    });
  }
}