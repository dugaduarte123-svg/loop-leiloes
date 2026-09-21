import { isWindowsMobile } from './whichDevice';
import { isEmbeddedInProduct } from './isEmbeddedInProduct';
import { getPortalIdFromPath } from './getPortalIdFromPath';
import { isUsingUnsupportedFramework } from './isUsingUnsupportedFramework';
export const shouldRenderWidget = ({
  portalId
}) => {
  var _window;
  const hasPortalId = !!getPortalIdFromPath(window.location.pathname);
  const portalIdRequired = isEmbeddedInProduct({
    portalId
  });
  const missingPortalId = portalIdRequired && !hasPortalId;
  const isOnEmbededMeetingsPage = (_window = window) === null || _window === void 0 || (_window = _window.disabledHsPopups) === null || _window === void 0 ? void 0 : _window.includes('LIVE_CHAT');
  if (isWindowsMobile()) {
    return {
      shouldRender: false,
      reason: 'WINDOWS_PHONE'
    };
  }
  if (isUsingUnsupportedFramework()) {
    return {
      shouldRender: false,
      reason: 'UNSUPPORTED_FRAMEWORK'
    };
  }
  if (missingPortalId) {
    return {
      shouldRender: false,
      reason: 'MISSING_PORTAL_ID'
    };
  }
  if (isOnEmbededMeetingsPage) {
    return {
      shouldRender: false,
      reason: 'IS_EMBEDDED_MEETINGS'
    };
  }
  return {
    shouldRender: true
  };
};