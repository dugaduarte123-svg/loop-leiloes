import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["children", "disabled", "onClick", "data-test-id"];
import styled from 'styled-components';
import { useMenuContext } from './VizExMenu';
import { getFocusRingStyles } from '../utils/getFocusRingStyles';
import { jsx as _jsx } from "react/jsx-runtime";
const ItemButton = styled.button.withConfig({
  displayName: "VizExMenuItem__ItemButton"
})(["display:flex;align-items:center;gap:8px;width:100%;padding:4px 20px;min-height:40px;text-align:left;background:none;border:none;cursor:pointer;font-size:14px;white-space:nowrap;transition:background-color 0.2s ease;&[aria-disabled='true']{cursor:not-allowed;opacity:0.5;}&:hover:not([aria-disabled='true']){background-color:rgba(0,0,0,0.04);}", ""], getFocusRingStyles({
  outlineOffset: '-2px'
}));
const VizExMenuItem = _ref => {
  let {
      children,
      disabled = false,
      onClick,
      'data-test-id': testId
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const {
    close
  } = useMenuContext();
  const handleClick = () => {
    if (disabled) return;
    close();
    onClick === null || onClick === void 0 || onClick();
  };
  return /*#__PURE__*/_jsx(ItemButton, Object.assign({
    role: "menuitem",
    onClick: handleClick,
    "aria-disabled": disabled,
    "data-test-id": testId
  }, rest, {
    children: children
  }));
};
VizExMenuItem.displayName = 'VizExMenuItem';
export default VizExMenuItem;