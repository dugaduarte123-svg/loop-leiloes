import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["use", "size", "children"];
import { forwardRef } from 'react';
import styled from 'styled-components';
import { MEDIUM } from '../constants/sizes';
import * as ButtonUses from './constants/ButtonUses';
import mergeThemeStyles from '../theme/mergeThemeStyles';
import { buttonTheme } from './theme/buttonTheme';
import { jsx as _jsx } from "react/jsx-runtime";
const AbstractVizExButton = styled.button.withConfig({
  displayName: "VizExButton__AbstractVizExButton"
})(["", ""], ({
  theme
}) => mergeThemeStyles({
  component: 'Button',
  defaultStyles: buttonTheme,
  theme
}));
const NoSelect = styled.div.withConfig({
  displayName: "VizExButton__NoSelect"
})(["user-select:none;"]);
const VizExButton = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
      use = ButtonUses.SECONDARY,
      size = MEDIUM,
      children
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsx(AbstractVizExButton, Object.assign({}, Object.assign({
    use,
    size
  }, rest), {
    ref: ref,
    children: /*#__PURE__*/_jsx(NoSelect, {
      children: children
    })
  }));
});
VizExButton.displayName = 'VizExButton';
export default VizExButton;