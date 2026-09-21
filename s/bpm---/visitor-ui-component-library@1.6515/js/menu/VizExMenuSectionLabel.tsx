import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["children"];
import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
const LabelWrapper = styled.div.withConfig({
  displayName: "VizExMenuSectionLabel__LabelWrapper"
})(["font-size:12px;font-weight:400;line-height:18px;color:#666;padding:7px 20px;min-height:32px;box-sizing:border-box;"]);
const VizExMenuSectionLabel = _ref => {
  let {
      children
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsx(LabelWrapper, Object.assign({
    role: "presentation"
  }, rest, {
    children: children
  }));
};
VizExMenuSectionLabel.displayName = 'VizExMenuSectionLabel';
export default VizExMenuSectionLabel;