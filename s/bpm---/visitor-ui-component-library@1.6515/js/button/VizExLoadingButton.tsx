import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["use", "children", "Button", "result", "spinnerSize", "theme", "currentState", "onClick"];
import styled from 'styled-components';
import VizExLoadingSpinner from '../loading/VizExLoadingSpinner';
import LoadingButtonUses, { buttonUse, spinnerUse } from './constants/LoadingButtonUses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const Spinner = styled(VizExLoadingSpinner).withConfig({
  displayName: "VizExLoadingButton__Spinner"
})(["height:0;position:absolute;top:50%;right:0;transition:opacity 0.2s;opacity:", ";"], ({
  show
}) => show ? 1 : 0);
const ReadyWrapper = styled.div.withConfig({
  displayName: "VizExLoadingButton__ReadyWrapper"
})(["transition:opacity 0.2s;opacity:", ";"], ({
  show
}) => show ? 1 : 0);
const VizExLoadingButton = _ref => {
  let {
      use = LoadingButtonUses.PRIMARY,
      children,
      Button,
      result,
      spinnerSize = 'xs',
      theme,
      currentState,
      onClick = () => {}
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const isReady = currentState === 'ready';
  const isSubmitting = currentState === 'submitting';
  const isDone = currentState === 'done';
  return /*#__PURE__*/_jsxs(Button, Object.assign({
    theme: theme,
    onClick: isSubmitting || isDone ? () => {} : onClick,
    use: buttonUse(use),
    style: {
      position: 'relative'
    },
    "data-test-id": "loading-button"
  }, rest, {
    children: [/*#__PURE__*/_jsx(ReadyWrapper, {
      "data-test-id": "VizExLoadingButton-Ready",
      show: isReady,
      children: children
    }), /*#__PURE__*/_jsx(Spinner, {
      size: spinnerSize,
      grow: true,
      use: spinnerUse(use),
      theme: theme,
      showResult: isDone,
      show: isSubmitting || isDone,
      "data-test-id": "VizExLoadingButton-Spinner",
      children: result
    })]
  }));
};
VizExLoadingButton.displayName = 'VizExLoadingButton';
export default VizExLoadingButton;