export const getViewportHeight = () => {
  return Math.max(window.innerHeight || 0, document.documentElement.clientHeight);
};