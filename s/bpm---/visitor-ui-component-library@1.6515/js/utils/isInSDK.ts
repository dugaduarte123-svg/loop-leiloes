export const SDK_USER_AGENT_REGEX = /Hub[sS]pot ?Mobile ?SDK/;
const VERSION_REGEX = /\/(\d+\.\d+\.\d+)/;
const SDK_USER_AGENT_WITH_VERSION_REGEX = new RegExp(SDK_USER_AGENT_REGEX.source + VERSION_REGEX.source);
export const isInSDK = () => SDK_USER_AGENT_REGEX.test(window.navigator.userAgent);
export const hasMinimumMobileSdkVersion = ({
  minMajor,
  minMinor,
  minPatch
}) => {
  const userAgent = window.navigator.userAgent;
  const match = userAgent.match(SDK_USER_AGENT_WITH_VERSION_REGEX);
  if (!match) {
    return false;
  }
  const [, version] = match;
  const [sdkMajor, sdkMinor, sdkPatch] = version.split('.').map(Number);
  return sdkMajor > minMajor || sdkMajor === minMajor && sdkMinor > minMinor || sdkMajor === minMajor && sdkMinor === minMinor && sdkPatch >= minPatch;
};