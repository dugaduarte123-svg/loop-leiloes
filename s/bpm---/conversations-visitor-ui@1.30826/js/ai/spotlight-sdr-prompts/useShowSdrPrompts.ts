import { useCallback, useEffect, useRef, useState } from 'react';
import { getIsUngatedForAiSdr } from '../../widget-data/operators/getIsUngatedForAiSdr';
export const useShowSdrPrompts = ({
  open,
  hasExistingThread,
  hasAnyPersistedThreads,
  requiresConsent
}) => {
  const [promptsRequested, setPromptsRequested] = useState(false);
  const isAiSdrFresh = getIsUngatedForAiSdr() && !hasExistingThread && !hasAnyPersistedThreads && !requiresConsent;
  const prevOpenRef = useRef(open);
  useEffect(() => {
    if (prevOpenRef.current && !open && isAiSdrFresh) {
      setPromptsRequested(true);
    }
    prevOpenRef.current = open;
  }, [open, isAiSdrFresh]);
  const collapsePrompts = useCallback(() => setPromptsRequested(false), []);
  const showPrompts = isAiSdrFresh && promptsRequested && !open;
  return {
    showPrompts,
    isCollapsedButton: isAiSdrFresh && !promptsRequested,
    collapsePrompts
  };
};