import { createContext } from 'react';
export const flushMarkerQueue = (markerQueue, dispatch) => {
  while (markerQueue.length > 0) {
    dispatch(markerQueue.shift());
  }
};
export default /*#__PURE__*/createContext({
  id: 0,
  dispatch: () => {},
  reportAction: () => {},
  trackVisibility: false,
  markerQueue: []
});