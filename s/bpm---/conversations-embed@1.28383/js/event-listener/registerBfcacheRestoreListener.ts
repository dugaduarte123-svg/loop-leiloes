export const registerBfcacheRestoreListener = ({
  onRestore
}) => {
  const handler = event => {
    if (event.persisted) {
      onRestore();
    }
  };
  window.addEventListener('pageshow', handler);
  return () => window.removeEventListener('pageshow', handler);
};