import performance from '../vendor/performance';
export const navigationType = () => {
  try {
    const navigationEntries = performance.getEntriesByType('navigation');
    return navigationEntries && navigationEntries[0] && navigationEntries[0].type;
  } catch (_unused) {
    return null;
  }
};
export const performanceGetEntriesByType = type => {
  try {
    return performance.getEntriesByType(type);
  } catch (_unused2) {
    return null;
  }
};
export const isReload = () => navigationType() === 'reload';
export const isHashNavigation = () => window.location.hash !== '';