import { useEffect } from 'react';

/**
 * Calls `onEscape` when Escape is pressed within `ref`'s subtree.
 * Attaches the listener directly to the ref element so it works inside shadow DOM
 * (document-level listeners lose shadow root context via event retargeting).
 * Pass `enabled=false` to pause the listener without unmounting.
 */
const useOnEscapeKey = (ref, onEscape, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    const handleKeyDown = e => {
      if (e.key === 'Escape') onEscape();
    };
    element.addEventListener('keydown', handleKeyDown);
    return () => element.removeEventListener('keydown', handleKeyDown);
  }, [ref, onEscape, enabled]);
};
export default useOnEscapeKey;