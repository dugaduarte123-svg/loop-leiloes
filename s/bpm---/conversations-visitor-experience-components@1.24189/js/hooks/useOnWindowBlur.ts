import { useEffect } from 'react';

/**
 * Calls `onBlur` when the browser window loses focus (e.g. user switches apps).
 * Pass `enabled=false` to pause the listener without unmounting.
 */
const useOnWindowBlur = (onBlur, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [onBlur, enabled]);
};
export default useOnWindowBlur;