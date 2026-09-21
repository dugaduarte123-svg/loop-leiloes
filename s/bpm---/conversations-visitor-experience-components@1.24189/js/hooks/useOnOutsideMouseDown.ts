import { useEffect } from 'react';

/**
 * Calls `onOutsideMouseDown` when a mousedown event occurs outside `ref`.
 * Pass `enabled=false` to pause the listener without unmounting.
 */
const useOnOutsideMouseDown = (ref, onOutsideMouseDown, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const handleMouseDown = e => {
      var _ref$current;
      if (!((_ref$current = ref.current) !== null && _ref$current !== void 0 && _ref$current.contains(e.target))) {
        onOutsideMouseDown();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref, onOutsideMouseDown, enabled]);
};
export default useOnOutsideMouseDown;