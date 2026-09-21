import { useState, useCallback, useEffect, useRef } from 'react';
import { postMessageToParent } from '../post-message/postMessageToParent';
import { IFRAME_RESIZE } from '../constants/PostMessageTypes';

/**
 * Custom hook to measure the width and height of the widget,
 * and post message to parent when width or height changes.
 *
 * @param isDraggingRef - When provided, resize messages are suppressed while
 *   its `.current` is `true`. This prevents conflicting resize messages from
 *   being sent during drag gestures that intentionally expand the iframe to the
 *   full viewport.
 */

export function useMeasure({
  isDraggingRef
}) {
  const [{
    width,
    height
  }, set] = useState({
    width: 0,
    height: 0
  });
  const previousObserver = useRef(null);

  /**
   * Resize observer to measure the width and height of the widget
   */
  const customRef = useCallback(node => {
    if (previousObserver.current) {
      previousObserver.current.disconnect();
      previousObserver.current = null;
    }
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      const observer = new ResizeObserver(([entry]) => setTimeout(() => {
        if (entry.borderBoxSize && entry.borderBoxSize[0]) {
          const {
            inlineSize,
            blockSize
          } = entry.borderBoxSize[0];
          set({
            width: inlineSize,
            height: blockSize
          });
        } else {
          // Fallback for browsers that don't support borderBoxSize
          const {
            offsetWidth,
            offsetHeight
          } = node;
          set({
            width: offsetWidth,
            height: offsetHeight
          });
        }
      }, 0));
      observer.observe(node);
      previousObserver.current = observer;
    }
  }, []);

  /**
   * Post message to parent when width or height changes
   */
  useEffect(() => {
    if (width && height && !(isDraggingRef !== null && isDraggingRef !== void 0 && isDraggingRef.current)) {
      postMessageToParent(IFRAME_RESIZE, {
        width,
        height
      });
    }
  }, [width, height, isDraggingRef]);
  return customRef;
}