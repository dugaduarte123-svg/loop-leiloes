import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["onClick", "theme", "size"];
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExIconButton from './VizExIconButton';
import VizExIcon from '../icon/VizExIcon';
import styled, { css, ThemeConsumer } from 'styled-components';
import { TRANSPARENT_ON_BACKGROUND } from './constants/IconButtonUses';
import { CIRCLE } from './constants/IconButtonShapes';
import { EXTRA_SMALL, MEDIUM, SMALL } from '../constants/sizes';
import { setTransparentOnBackgroundIconButton } from './theme/iconButtonThemeOperators';
import { getCloseButtonColor } from './theme/closeButtonThemeOperators';
import { ICON_BUTTON_SIZE_TO_ICON_SIZE } from './constants/IconButtonSizeToIconSize';
import { jsx as _jsx } from "react/jsx-runtime";
const getMarginStyles = ({
  size
}) => {
  switch (size) {
    case EXTRA_SMALL:
    case SMALL:
      return css(["margin-top:8px;margin-right:8px;"]);
    case MEDIUM:
    default:
      return css(["margin-top:12px;margin-right:12px;"]);
  }
};
export const ButtonContainer = styled(VizExIconButton).withConfig({
  displayName: "VizExCloseButton__ButtonContainer"
})(["right:0;position:absolute;top:0;", ""], getMarginStyles);
const VizExCloseButton = props => {
  const {
      onClick,
      theme,
      size
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsx(ThemeConsumer, {
    children: contextTheme => /*#__PURE__*/_jsx(ButtonContainer, Object.assign({}, rest, {
      onClick: onClick,
      theme: setTransparentOnBackgroundIconButton(getCloseButtonColor(theme || contextTheme), theme || contextTheme),
      use: TRANSPARENT_ON_BACKGROUND,
      shape: CIRCLE,
      size: size,
      children: /*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(SVGClose, {}),
        size: ICON_BUTTON_SIZE_TO_ICON_SIZE[size || MEDIUM]
      })
    }))
  });
};
VizExCloseButton.displayName = 'VizExCloseButton';
export default VizExCloseButton;