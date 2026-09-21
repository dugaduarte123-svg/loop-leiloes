import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["icon", "size"];
import styled, { css } from 'styled-components';
import { ICON_SIZES } from './constants/IconSizes';
import { getIconColor } from './theme/iconThemeOperators';
import { jsx as _jsx } from "react/jsx-runtime";
function isIconSize(size) {
  return Object.keys(ICON_SIZES).includes(size);
}
const getIconSizeStyles = size => css(["font-size:", ";height:", ";width:", ";"], size && isIconSize(size) ? `${ICON_SIZES[size]}px` : size, size && isIconSize(size) ? `${ICON_SIZES[size]}px` : size, size && isIconSize(size) ? `${ICON_SIZES[size]}px` : size);
const IconWrapper = styled.div.withConfig({
  displayName: "VizExIcon__IconWrapper"
})(["display:inline-flex;vertical-align:middle;fill:", ";", ""], ({
  theme
}) => getIconColor(theme) || 'currentColor', ({
  size
}) => size && getIconSizeStyles(size));
const VizExIcon = props => {
  const {
      icon,
      size
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsx(IconWrapper, Object.assign({}, rest, {
    size: size,
    children: icon
  }));
};
VizExIcon.displayName = 'VizExIcon';
export default VizExIcon;