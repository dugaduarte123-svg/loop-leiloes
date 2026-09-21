import { isFunction } from './isFunction';
export const hasRequiredFeatures = window => {
  const {
    requestAnimationFrame,
    WeakMap,
    URLSearchParams,
    Promise: {
      all
    } = {
      all: undefined
    },
    Promise: {
      resolve
    } = {
      resolve: undefined
    }
  } = window;
  return [requestAnimationFrame, WeakMap, URLSearchParams, all, resolve].every(isFunction);
};