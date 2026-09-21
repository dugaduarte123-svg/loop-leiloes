import hubspot from 'hubspot';
export function getStaticAppName(staticAppInfo) {
  var _hubspot$bender;
  if (staticAppInfo !== null && staticAppInfo !== void 0 && staticAppInfo.staticAppName) {
    return staticAppInfo.staticAppName;
  }
  if (hubspot !== null && hubspot !== void 0 && (_hubspot$bender = hubspot.bender) !== null && _hubspot$bender !== void 0 && _hubspot$bender.currentProject) {
    return hubspot.bender.currentProject;
  }
  return '';
}
export function getStaticAppVersion(staticAppInfo) {
  var _hubspot$bender2;
  if (staticAppInfo !== null && staticAppInfo !== void 0 && staticAppInfo.staticAppVersion) {
    return staticAppInfo.staticAppVersion;
  }
  if (hubspot !== null && hubspot !== void 0 && (_hubspot$bender2 = hubspot.bender) !== null && _hubspot$bender2 !== void 0 && _hubspot$bender2.currentProjectVersion) {
    return hubspot.bender.currentProjectVersion;
  }
  return '';
}