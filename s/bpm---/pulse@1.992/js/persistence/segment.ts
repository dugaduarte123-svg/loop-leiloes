import quickFetch from 'quick-fetch';
import { isHubteamDomain } from '../utils/isHubteamDomain';
const appAuthSegment = () => {
  if (!quickFetch.getLoginVerifyRequest()) {
    return Promise.reject(Error('quickFetch login-verify not available'));
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const err = Error('quickFetch afterAuth timed out');
      reject(err);
    }, 20000);
    quickFetch.afterAuth(auth => {
      var _auth$portal, _auth$user;
      clearTimeout(timeout);
      const portalId = auth === null || auth === void 0 || (_auth$portal = auth.portal) === null || _auth$portal === void 0 ? void 0 : _auth$portal.portal_id;
      const userId = auth === null || auth === void 0 || (_auth$user = auth.user) === null || _auth$user === void 0 ? void 0 : _auth$user.user_id;
      if (portalId == null || userId == null) {
        reject(Error('quickFetch auth missing portalId or userId'));
        return;
      }
      resolve(`${portalId}/${userId}`);
    });
  });
};
const janusSegment = () => import('hub-http-janus/userInfo').then(({
  safeGetUsername
}) => {
  const username = safeGetUsername();
  if (!username) {
    return Promise.reject(Error('Janus username not available — hs_tools_auth cookie missing'));
  }
  return `janus/${username}`;
});
export const getSegment = () => {
  var _window$location;
  if (typeof window === 'undefined' || !((_window$location = window.location) !== null && _window$location !== void 0 && _window$location.hostname)) {
    return null;
  }
  return isHubteamDomain() ? janusSegment() : appAuthSegment();
};