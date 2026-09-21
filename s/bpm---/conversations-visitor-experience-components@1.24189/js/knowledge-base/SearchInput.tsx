import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["onChange"];
import I18n from 'I18n';
import styled from 'styled-components';
import VizExInput from 'visitor-ui-component-library/input/VizExInput';
import SVGSearch from 'visitor-ui-component-library-icons/icons/SVGSearch';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import { useCallback, useEffect, useRef } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const StyledIcon = styled(VizExIcon).withConfig({
  displayName: "SearchInput__StyledIcon"
})(["margin-left:8px;color:", ";"], ({
  theme
}) => theme.colors.primary);
const StyledInputWrapper = styled.div.withConfig({
  displayName: "SearchInput__StyledInputWrapper"
})(["width:100%;margin-top:0px;transition:width 0.4s ease;"]);
const StyledInput = styled(VizExInput).withConfig({
  displayName: "SearchInput__StyledInput"
})(["font-family:", ";font-size:16px;line-height:24px;svg{height:16px;width:16px;}"], ({
  theme
}) => theme.fontFamily);
const ClearButton = styled.button.withConfig({
  displayName: "SearchInput__ClearButton"
})(["border-radius:100%;background-color:", ";color:", ";border:none;height:24px;width:24px;flex:0 0 auto;margin-right:8px;padding:0;display:flex;align-items:center;justify-content:center;transition:opacity 0.2s ease-in-out;&:hover:enabled{opacity:0.8;}svg{fill:currentColor;height:12px;width:12px;}"], ({
  theme
}) => theme.colors.primary, ({
  theme
}) => theme.colors.textOnPrimary);
export default function SearchInput(_ref) {
  let {
      onChange
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const inputRef = useRef(null);
  const clearInput = useCallback(() => onChange(''), [onChange]);
  const onKeyDown = useCallback(e => {
    if (e.key === 'Escape' && props.value) {
      e.preventDefault();
      e.stopPropagation();
      clearInput();
    }
  }, [clearInput, props.value]);
  useEffect(() => {
    if (inputRef !== null && inputRef !== void 0 && inputRef.current && props.value) {
      inputRef.current.focus();
    }
  }, [props.value]);
  return /*#__PURE__*/_jsx(StyledInputWrapper, {
    role: "search",
    children: /*#__PURE__*/_jsx(StyledInput, Object.assign({
      containerStyles: {
        backgroundColor: 'white',
        height: '40px',
        borderRadius: '20px',
        border: 'none'
      },
      onKeyDown: onKeyDown,
      onChange: e => onChange(e.currentTarget.value),
      "aria-label": I18n.text('conversations-visitor-experience-components.knowledgeBaseSearch.searchLabel'),
      placeholder: I18n.text('conversations-visitor-experience-components.knowledgeBaseSearch.searchPlaceholder'),
      prefix: /*#__PURE__*/_jsx(StyledIcon, {
        icon: /*#__PURE__*/_jsx(SVGSearch, {}),
        size: "sm"
      }),
      suffix: props.value && /*#__PURE__*/_jsx(ClearButton, {
        "aria-label": I18n.text('conversations-visitor-experience-components.knowledgeBaseSearch.clearSearch'),
        onClick: clearInput,
        children: /*#__PURE__*/_jsx(SVGClose, {})
      }),
      role: "searchbox",
      ref: inputRef
    }, props))
  });
}
SearchInput.displayName = 'SearchInput';