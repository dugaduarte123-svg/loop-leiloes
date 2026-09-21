export const registerWindowResizeListener = ({
  resizeCallbackFn
}) => {
  window.addEventListener('resize', resizeCallbackFn, {
    passive: true
  });
};