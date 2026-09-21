import { useEffect, useRef, useState } from 'react';
const ANIMATION_DURATION = 450;
export function useOpeningExpandedTransition(open, isExpanded) {
  const [isOpeningExpanded, setIsOpeningExpanded] = useState(false);
  const prevOpenRef = useRef(open);
  const isExpandedRef = useRef(isExpanded);
  isExpandedRef.current = isExpanded;
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;
    if (!wasOpen && open && isExpandedRef.current) {
      setIsOpeningExpanded(true);
      const timer = setTimeout(() => setIsOpeningExpanded(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);
  return isOpeningExpanded;
}