import { useRef, useState, useLayoutEffect } from 'react';
/**
 * Measures the width an element wants to be without any fixed constraints.
 * This is useful when we need to set a fixed width on an element while letting it naturally flow.
 */

const measureNaturalWidth = element => {
  const temp = element.cloneNode(true);
  temp.style.width = 'max-content';
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.top = '-9999px';
  let parentNode = element.parentNode;
  if (!parentNode) {
    parentNode = document.body;
  }
  parentNode.insertBefore(temp, element.nextSibling);
  const width = temp.offsetWidth;
  parentNode.removeChild(temp);
  return width;
};
export const useMeasureNaturalWidth = (getDependencies, props = {}) => {
  var _getDependencies;
  const {
    onMeasured
  } = props;
  const contentRef = useRef(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const dependencies = (_getDependencies = getDependencies === null || getDependencies === void 0 ? void 0 : getDependencies()) !== null && _getDependencies !== void 0 ? _getDependencies : [];
  useLayoutEffect(() => {
    if (contentRef.current) {
      const frameId = requestAnimationFrame(() => {
        if (contentRef.current) {
          const width = measureNaturalWidth(contentRef.current);
          setMeasuredWidth(width);
          onMeasured === null || onMeasured === void 0 || onMeasured(width);
        }
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    contentRef,
    measuredWidth,
    isReady: measuredWidth !== 0
  };
};