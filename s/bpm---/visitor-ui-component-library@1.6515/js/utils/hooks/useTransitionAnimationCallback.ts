import { useEffect, useRef } from 'react';
export const useTransitionAnimationCallbacks = (options = {}, externalRef) => {
  const {
    onTransitionStart,
    onTransitionEnd
  } = options;
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handleTransitionStart = () => {
      onTransitionStart === null || onTransitionStart === void 0 || onTransitionStart();
    };
    const handleTransitionEnd = () => {
      onTransitionEnd === null || onTransitionEnd === void 0 || onTransitionEnd();
    };
    element.addEventListener('transitionstart', handleTransitionStart, false);
    element.addEventListener('transitionend', handleTransitionEnd, false);
    return () => {
      element.removeEventListener('transitionstart', handleTransitionStart, false);
      element.removeEventListener('transitionend', handleTransitionEnd, false);
    };
  }, [onTransitionStart, onTransitionEnd, externalRef, ref]);
  return {
    ref
  };
};