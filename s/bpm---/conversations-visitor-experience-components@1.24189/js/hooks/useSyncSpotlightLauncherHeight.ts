import { useEffect } from 'react';
import { useSpotlightLayout } from '../contexts/SpotlightLayoutContext';

/**
 * Observes the spotlight launcher area and writes its height into
 * SpotlightLayoutContext, so the widget panel above can shrink to keep the
 * whole layout within the viewport.
 *
 */
export const useSyncSpotlightLauncherHeight = (launcherAreaRef, isRendered) => {
  const {
    setLauncherHeight
  } = useSpotlightLayout();
  useEffect(() => {
    const el = launcherAreaRef.current;
    if (!el) return;
    let frame = null;
    const observer = new ResizeObserver(([entry]) => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        var _entry$borderBoxSize$, _entry$borderBoxSize;
        setLauncherHeight((_entry$borderBoxSize$ = (_entry$borderBoxSize = entry.borderBoxSize) === null || _entry$borderBoxSize === void 0 || (_entry$borderBoxSize = _entry$borderBoxSize[0]) === null || _entry$borderBoxSize === void 0 ? void 0 : _entry$borderBoxSize.blockSize) !== null && _entry$borderBoxSize$ !== void 0 ? _entry$borderBoxSize$ : el.offsetHeight);
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [launcherAreaRef, isRendered, setLauncherHeight]);
};