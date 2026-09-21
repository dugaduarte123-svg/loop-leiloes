import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["shape", "size", "use"];
import styled from 'styled-components';
import * as IconButtonUses from './constants/IconButtonUses';
import { DEFAULT } from './constants/IconButtonShapes';
import { MEDIUM } from '../constants/sizes';
import { forwardRef } from 'react';
import { iconButtonTheme } from './theme/iconButtonTheme';
import mergeThemeStyles from '../theme/mergeThemeStyles';
import { jsx as _jsx } from "react/jsx-runtime";
const AbstractVizExIconButton = styled.button.withConfig({
  displayName: "VizExIconButton__AbstractVizExIconButton"
})(["", ""], ({
  theme
}) => mergeThemeStyles({
  component: 'IconButton',
  defaultStyles: iconButtonTheme,
  theme
}));
const VizExIconButton = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
      shape = DEFAULT,
      size = MEDIUM,
      use = IconButtonUses.PRIMARY
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsx(AbstractVizExIconButton, Object.assign({
    shape: shape,
    size: size,
    use: use,
    ref: ref
  }, rest));
});
VizExIconButton.displayName = 'VizExIconButton';
export default VizExIconButton;