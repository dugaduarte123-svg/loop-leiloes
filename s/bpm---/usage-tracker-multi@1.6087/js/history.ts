import { lWindow } from 'usage-tracker-core/common/helpers';
export const createHistory = (rWindow = lWindow) => {
  const hasWindowAndHistory = typeof rWindow === 'object' && typeof rWindow.history === 'object';
  const getCurrentState = () => hasWindowAndHistory && rWindow.history.state && rWindow.history.state.state || {};
  return {
    get location() {
      if (hasWindowAndHistory) {
        return {
          pathname: rWindow.location.pathname,
          search: rWindow.location.search,
          hash: rWindow.location.hash,
          state: getCurrentState(),
          key: getCurrentState().key || ''
        };
      }
      return {
        pathname: '',
        search: '',
        hash: '',
        state: getCurrentState(),
        key: getCurrentState().key || ''
      };
    },
    replace: (location, state = {}) => {
      if (hasWindowAndHistory) {
        rWindow.history.replaceState(Object.assign({}, state), '', typeof location === 'string' ? `${rWindow.location.origin}${location}` : location.toString());
      }
    },
    push: (location, state = {}) => {
      if (hasWindowAndHistory) {
        rWindow.history.pushState(Object.assign({}, state), '', typeof location === 'string' ? `${rWindow.location.origin}${location}` : location.toString());
      }
    }
  };
};