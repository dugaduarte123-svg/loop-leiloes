let appInfo = null;
export const setAppInfo = (name, version) => {
  appInfo = {
    name,
    version
  };
};
export const getAppInfo = () => {
  if (appInfo) {
    return appInfo;
  }
  const hubspot = window.hubspot;
  return hubspot && hubspot.bender ? {
    name: hubspot.bender.currentProject,
    version: hubspot.bender.currentProjectVersion
  } : null;
};