import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["placeholder", "suffix", "prefix", "disabled", "value", "onChange", "containerStyles", "theme", "use", "focus"];
import styled, { css } from 'styled-components';
import { ON_DARK, DEFAULT } from './constants/InputVariations';
import { getBodyTypographyStyles } from '../typography/utils/getBodyTypographyStyles';
import { getInputOnDarkBackgroundColor, getInputDisabledBackgroundColor, getInputDisabledTextColor, getInputPlaceholderColor, getInputFocusColor } from './theme/inputThemeOperators';
import { getInputBorderColor, getInputBackgroundColor } from '../theme/defaultThemeOperators';
import { forwardRef } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const getContainerVariationStyles = ({
  use
}) => {
  switch (use) {
    case ON_DARK:
      return css(["background-color:", ";"], getInputOnDarkBackgroundColor());
    case DEFAULT:
    default:
      return null;
  }
};
const getContainerDisabledStyles = ({
  theme
}) => css(["cursor:not-allowed;background-color:", ";"], getInputDisabledBackgroundColor(theme));
const getInputDisabledStyles = ({
  theme
}) => css(["color:", ";cursor:not-allowed;&::after{color:", ";}"], getInputDisabledTextColor(theme), getInputDisabledTextColor(theme));
const StyledTextInput = styled.input.withConfig({
  displayName: "VizExInput__StyledTextInput"
})(["", ";width:100%;padding-left:10px;padding-right:10px;border:none;background:transparent;", ";:focus{outline:none;}::placeholder{color:", ";}height:32px;border-radius:4px;font-size:12px;line-height:24px;font-weight:400px;"], getBodyTypographyStyles, props => props.disabled && getInputDisabledStyles(props), ({
  theme
}) => getInputPlaceholderColor(theme));
const InputContainer = styled.div.withConfig({
  displayName: "VizExInput__InputContainer"
})(["line-height:22px;font-size:16px;display:flex;flex-direction:row;justify-content:space-between;align-items:center;border:1px solid;height:32px;border-radius:4px;border-color:", ";background-color:", ";:focus-within{border-color:", ";}", " ", ";"], ({
  theme,
  focus
}) => focus ? getInputFocusColor(theme) : getInputBorderColor(theme), ({
  theme
}) => getInputBackgroundColor(theme), ({
  theme
}) => getInputFocusColor(theme), getContainerVariationStyles, props => props.disabled && getContainerDisabledStyles(props));
const VizExInput = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
      placeholder = '',
      suffix,
      prefix,
      disabled,
      value,
      onChange,
      containerStyles,
      theme,
      use,
      focus
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsxs(InputContainer, {
    disabled: disabled,
    style: containerStyles,
    theme: theme,
    use: use,
    focus: focus,
    "data-test-id": "VizExInput-Container",
    children: [prefix, /*#__PURE__*/_jsx(StyledTextInput, Object.assign({
      "aria-disabled": disabled,
      disabled: disabled,
      placeholder: placeholder,
      value: value,
      onChange: onChange,
      theme: theme,
      use: use,
      "data-test-id": "VizExInput-Input",
      ref: ref
    }, rest)), suffix]
  });
});
VizExInput.displayName = 'VizExInput';
export default VizExInput;