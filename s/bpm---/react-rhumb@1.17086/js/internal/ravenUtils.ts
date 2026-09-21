import Raven from 'raven-js';
const LIBRARY_NAME = 'react-rhumb';
export function captureException(error, options = {}) {
  Raven.captureException(error, Object.assign({}, options, {
    tags: Object.assign({}, options.tags, {
      library_name: LIBRARY_NAME
    })
  }));
}
export function captureMessage(message, options = {}) {
  Raven.captureMessage(message, Object.assign({}, options, {
    tags: Object.assign({}, options.tags, {
      library_name: LIBRARY_NAME
    })
  }));
}
export function capturePageEvent(name, options = {}) {
  Raven.capturePageEvent(name, Object.assign({}, options, {
    tags: Object.assign({}, options.tags, {
      library_name: LIBRARY_NAME
    })
  }));
}