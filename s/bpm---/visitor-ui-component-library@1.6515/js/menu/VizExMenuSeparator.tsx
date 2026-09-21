import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["inset"];
import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
const SeparatorWrapper = styled.div.withConfig({
  displayName: "VizExMenuSeparator__SeparatorWrapper"
})(["display:flex;align-items:center;padding:0 ", "px;min-height:16px;"], ({
  $inset
}) => $inset);
const SeparatorLine = styled.div.withConfig({
  displayName: "VizExMenuSeparator__SeparatorLine"
})(["width:100%;height:1px;background-color:rgba(0,0,0,0.1);"]);
const VizExMenuSeparator = _ref => {
  let {
      inset = 0
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsx(SeparatorWrapper, Object.assign({
    role: "separator",
    $inset: inset
  }, rest, {
    children: /*#__PURE__*/_jsx(SeparatorLine, {})
  }));
};
VizExMenuSeparator.displayName = 'VizExMenuSeparator';
export default VizExMenuSeparator;