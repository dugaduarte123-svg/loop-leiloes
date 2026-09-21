import anonymousTracker from './anonymous';
import authedTracker from './authed';
import publicTracker from './public';
export const trackerMap = {
  anonymous: anonymousTracker,
  authed: authedTracker,
  public: publicTracker
};