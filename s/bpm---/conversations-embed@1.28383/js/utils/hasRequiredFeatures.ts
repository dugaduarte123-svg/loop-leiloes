/**
 * This function exists because certain browser versions
 * do not support setting the `toString` property of a function,
 * which is required by redux toolkit.
 */
function canSetToString() {
  function test() {}
  try {
    test.toString = function () {};
    return true;
  } catch (e) {
    return false;
  }
}
export function hasRequiredFeatures(window) {
  const featureDetectors = [typeof window.WeakMap === 'function', typeof window.requestAnimationFrame === 'function', typeof window.URLSearchParams === 'function', typeof Object.fromEntries === 'function', canSetToString()];
  return featureDetectors.every(featureDetector => featureDetector);
}