import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["grow", "showResult", "resultAnimationDuration", "onResultDisplayFinish", "role", "size", "use", "children", "theme"];
import { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { LOADING_SPINNER_SIZES } from './constants/LoadingSpinnerSizes';
import { getLoadingSpinnerColor, getSecondaryLoadingSpinnerColor } from './theme/loadingSpinnerOperators';
import * as SpinnerUses from './constants/SpinnerUses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const privateSpin = keyframes(["100%{transform:rotate(360deg)}"]);
const SpinnerOuter = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__SpinnerOuter"
})(["position:relative;align-items:center;display:flex;margin:8px;", ";"], ({
  grow
}) => grow && css(["justify-content:center;width:100%;height:100%;margin:0;"]));
const SpinnerInner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__SpinnerInner"
})(["position:relative;align-items:center;display:flex;justify-content:center;width:", ";height:", ";color:", ";"], ({
  size
}) => `${size}px`, ({
  size
}) => `${size}px`, ({
  theme,
  use
}) => use === SpinnerUses.PRIMARY ? getLoadingSpinnerColor(theme) : getSecondaryLoadingSpinnerColor(theme));
const ResultSpinner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__ResultSpinner"
})(["align-items:center;display:flex;justify-content:center;opacity:", ";position:absolute;transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1) 0.1s,transform 0.2s cubic-bezier(0.2,0.9,0.3,2) 0.1s;transform:scale(1);"], ({
  showResult
}) => showResult ? '1' : '0');
const Spinner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__Spinner"
})(["transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1),transform 0.2s cubic-bezier(0.89,0.03,0.68,0.22);opacity:", ";position:absolute;display:block;width:100%;height:100%;&::after{position:relative;box-sizing:border-box;content:'';width:100%;height:100%;display:inline-block;border:2px solid currentColor;border-bottom-color:transparent;border-left-color:transparent;border-radius:100%;background:transparent;animation:", " 0.75s linear infinite;}"], ({
  showResult
}) => showResult ? '0' : '1', privateSpin);
const VizExLoadingSpinner = _ref => {
  let {
      grow = false,
      showResult = false,
      resultAnimationDuration = 1500,
      onResultDisplayFinish = () => {},
      role = 'status',
      size = 'sm',
      use = SpinnerUses.PRIMARY,
      children,
      theme
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const resultDisplayTimeoutRef = useRef(undefined);
  useEffect(() => {
    if (!showResult) return undefined;
    resultDisplayTimeoutRef.current = setTimeout(onResultDisplayFinish, resultAnimationDuration);
    return () => {
      clearTimeout(resultDisplayTimeoutRef.current);
    };
  }, [onResultDisplayFinish, resultAnimationDuration, showResult]);
  const spinnerSizePx = LOADING_SPINNER_SIZES[size];
  return /*#__PURE__*/_jsx(SpinnerOuter, Object.assign({
    role: role,
    "data-test-id": "loading-spinner"
  }, rest, {
    grow: grow,
    children: /*#__PURE__*/_jsxs(SpinnerInner, {
      size: spinnerSizePx,
      theme: theme,
      use: use,
      "data-test-id": "spinner-inner",
      children: [/*#__PURE__*/_jsx(Spinner, {
        showResult: showResult
      }), /*#__PURE__*/_jsx(ResultSpinner, {
        showResult: showResult,
        "data-test-id": "spinner-result",
        children: children
      })]
    })
  }));
};
VizExLoadingSpinner.displayName = 'VizExLoadingSpinner';
export default VizExLoadingSpinner;