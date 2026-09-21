import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["options", "disabled", "value", "onChange", "placeholder", "theme"];
import styled from 'styled-components';
import { getSelectBorderColor, getSelectBackgroundColor, getSelectArrowColor } from './theme/selectThemeOperators';
import { getTextColor } from '../theme/defaultThemeOperators';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export const PLACEHOLDER_VALUE = '__PLACEHOLDER_VALUE__';
const StyledSelect = styled.select.withConfig({
  displayName: "VizExMobileSelect__StyledSelect"
})(["appearance:none;background:none;border-radius:3px;border:1px solid transparent;color:inherit;cursor:inherit;font-size:16px;margin:0;outline:none;padding:8px 32px 10px 10px;width:100%;height:40px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;&::-ms-expand{display:none;}:focus::-ms-value{color:", ";background:transparent;}"], ({
  theme
}) => getTextColor(theme));
const SelectContainer = styled.div.withConfig({
  displayName: "VizExMobileSelect__SelectContainer"
})(["background-color:", ";border-radius:3px;border:1px solid ", ";cursor:pointer;display:block;font-size:16px;height:40px;line-height:22px;padding:0;position:relative;text-align:left;transition:all 0.15s ease-out;width:100%;&::after{border-color:transparent;border-style:solid;border-width:0.375em;display:inline-block;vertical-align:middle;border-top-color:", ";margin-top:0.375em;margin-top:-3px;content:' ';position:absolute;top:50%;right:1em;z-index:2;pointer-events:none;}"], ({
  theme
}) => getSelectBackgroundColor(theme), ({
  theme
}) => getSelectBorderColor(theme), ({
  theme
}) => getSelectArrowColor(theme));
const VizExMobileSelect = props => {
  const {
      options,
      disabled,
      value,
      onChange,
      placeholder,
      theme
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  const renderedOptions = options.map(({
    value: optionValue,
    text
  }) => {
    return /*#__PURE__*/_jsx("option", {
      value: optionValue,
      children: text
    }, optionValue);
  });
  return /*#__PURE__*/_jsx(SelectContainer, {
    theme: theme,
    children: /*#__PURE__*/_jsxs(StyledSelect, Object.assign({}, rest, {
      "data-test-id": "VizExSelect",
      disabled: disabled,
      defaultValue: PLACEHOLDER_VALUE,
      value: value,
      onChange: onChange,
      theme: theme,
      children: [placeholder && /*#__PURE__*/_jsx("option", {
        disabled: true,
        value: PLACEHOLDER_VALUE,
        children: placeholder
      }), renderedOptions]
    }))
  });
};
VizExMobileSelect.displayName = 'VizExMobileSelect';
export default VizExMobileSelect;