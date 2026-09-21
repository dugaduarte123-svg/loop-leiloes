import { Children, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import useOnEscapeKey from '../hooks/useOnEscapeKey';
import useOnOutsideMouseDown from '../hooks/useOnOutsideMouseDown';
import useOnWindowBlur from '../hooks/useOnWindowBlur';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const PopoverContainer = styled.div.withConfig({
  displayName: "SpotlightAddMenu__PopoverContainer"
})(["display:", ";position:absolute;bottom:100%;left:0;margin-bottom:6px;background-color:", ";border-radius:8px;box-shadow:0 2px 8px rgba(20,20,20,0.25);min-width:180px;z-index:9999;overflow:visible;outline:none;&:focus,&:focus-visible{outline:none;}"], ({
  $isOpen
}) => $isOpen ? 'block' : 'none', WHITE);
const SpotlightAddMenu = ({
  trigger,
  isOpen,
  onClose,
  children
}) => {
  const elementRef = useRef(null);
  useLayoutEffect(() => {
    var _elementRef$current;
    if (isOpen) (_elementRef$current = elementRef.current) === null || _elementRef$current === void 0 || _elementRef$current.focus({
      preventScroll: true
    });
  }, [isOpen]);
  useOnOutsideMouseDown(elementRef, onClose, isOpen);
  useOnEscapeKey(elementRef, onClose, isOpen);
  useOnWindowBlur(onClose, isOpen);
  if (Children.toArray(children).length === 0) return null;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [trigger, /*#__PURE__*/_jsx(PopoverContainer, {
      ref: elementRef,
      role: "menu",
      "aria-label": "Add options",
      $isOpen: isOpen,
      tabIndex: isOpen ? 0 : -1,
      children: children
    })]
  });
};
SpotlightAddMenu.displayName = 'SpotlightAddMenu';
export default SpotlightAddMenu;