import { useEffect, useRef, useCallback } from 'react';
import { useHover, useFocusWithin } from 'react-aria';
import { ANIMATION_DURATION } from '../visitor-widget/components/PillLauncherExpandedView';
const FOCUS_RESTORE_DELAY = ANIMATION_DURATION;
const REOPEN_DEBOUNCE = ANIMATION_DURATION + 50;
export const usePillLauncherExpandedViewInteractions = ({
  onOpenChange,
  launcherRef
}) => {
  const wrapperRef = useRef(null);
  const state = useRef({
    isOpen: false,
    canOpen: true
  });
  const open = useCallback(() => {
    const {
      isOpen,
      canOpen
    } = state.current;
    if (!isOpen && canOpen) {
      state.current = {
        isOpen: true,
        canOpen: true
      };
      onOpenChange(true);
    }
  }, [onOpenChange]);
  const close = useCallback((focusLauncher = false) => {
    if (!state.current.isOpen) return;
    state.current = {
      isOpen: false,
      canOpen: false
    };
    onOpenChange(false);
    setTimeout(() => {
      state.current.canOpen = true;
    }, REOPEN_DEBOUNCE);
    if (focusLauncher) {
      if (wrapperRef.current) {
        wrapperRef.current.setAttribute('inert', '');
      }
      setTimeout(() => {
        var _launcherRef$current;
        if (wrapperRef.current) {
          wrapperRef.current.removeAttribute('inert');
        }
        launcherRef === null || launcherRef === void 0 || (_launcherRef$current = launcherRef.current) === null || _launcherRef$current === void 0 || _launcherRef$current.focus();
      }, FOCUS_RESTORE_DELAY);
    }
  }, [onOpenChange, launcherRef]);
  useEffect(() => {
    const onEscape = e => e.key === 'Escape' && close(true);
    const onBlur = () => close();
    const onFocus = () => {
      requestAnimationFrame(() => {
        var _wrapperRef$current;
        if ((_wrapperRef$current = wrapperRef.current) !== null && _wrapperRef$current !== void 0 && _wrapperRef$current.contains(document.activeElement)) open();
      });
    };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('keydown', onEscape);
    };
  }, [close, open]);
  const {
    hoverProps
  } = useHover({
    onHoverStart: open,
    onHoverEnd: () => close()
  });
  const {
    focusWithinProps
  } = useFocusWithin({
    onFocusWithinChange: isFocusWithin => {
      if (isFocusWithin && state.current.canOpen) open();
    }
  });
  return {
    wrapperRef,
    interactionProps: Object.assign({}, hoverProps, focusWithinProps)
  };
};