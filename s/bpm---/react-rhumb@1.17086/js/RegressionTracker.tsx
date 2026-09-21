import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
const RegressionTrackerContainer = styled.div.withConfig({
  displayName: "RegressionTracker__RegressionTrackerContainer"
})(["position:fixed as const;right:100px;top:100px;z-index:1000;padding:15px;background:#ff7a59;color:#fff;border-radius:3px;"]);
const Row = styled.div.withConfig({
  displayName: "RegressionTracker__Row"
})(["display:flex;justify-content:space-between;"]);
const Label = styled.label.withConfig({
  displayName: "RegressionTracker__Label"
})(["margin-right:3px;"]);
const RegressionTracker = ({
  isTrackingVisibility,
  isAutoToggling,
  toggleTrackVisibility,
  setAutoToggle
}) => {
  return /*#__PURE__*/_jsx(_Fragment, {
    children: /*#__PURE__*/_jsxs(RegressionTrackerContainer, {
      children: [/*#__PURE__*/_jsxs(Row, {
        children: [/*#__PURE__*/_jsx(Label, {
          htmlFor: "toggleTrackVisibility",
          children: "Toggle Visibility Tracking"
        }), /*#__PURE__*/_jsx("input", {
          id: "toggleTrackVisibility",
          type: "checkbox",
          checked: isTrackingVisibility,
          onChange: toggleTrackVisibility
        })]
      }), /*#__PURE__*/_jsxs(Row, {
        children: [/*#__PURE__*/_jsx(Label, {
          htmlFor: "setAutoToggle",
          children: "Toggle Visibility Every 2s"
        }), /*#__PURE__*/_jsx("input", {
          id: "setAutoToggle",
          type: "checkbox",
          checked: isAutoToggling,
          onChange: setAutoToggle
        })]
      })]
    })
  });
};
export default RegressionTracker;