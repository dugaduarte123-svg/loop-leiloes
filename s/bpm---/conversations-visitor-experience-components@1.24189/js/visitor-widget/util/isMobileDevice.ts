export const isMobileDevice = () => {
  return !!/iPad|iPhone|iPod|Android|Mobi/.test(navigator.userAgent);
};