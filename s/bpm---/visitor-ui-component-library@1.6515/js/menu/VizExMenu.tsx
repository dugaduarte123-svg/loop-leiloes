import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
const MenuContext = /*#__PURE__*/createContext(null);
export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu compound components must be used within <VizExMenu>');
  }
  return context;
};
const MenuWrapper = styled.div.withConfig({
  displayName: "VizExMenu__MenuWrapper"
})(["position:relative;"]);
const VizExMenu = ({
  children,
  defaultOpen = false,
  onOpenChange
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const triggerRef = useRef(null);
  const shouldFocusTriggerRef = useRef(false);
  useEffect(() => {
    if (!isOpen && shouldFocusTriggerRef.current) {
      var _triggerRef$current;
      shouldFocusTriggerRef.current = false;
      (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 || _triggerRef$current.focus();
    }
  }, [isOpen]);
  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange === null || onOpenChange === void 0 || onOpenChange(true);
  }, [onOpenChange]);
  const close = useCallback(() => {
    shouldFocusTriggerRef.current = true;
    setIsOpen(false);
    onOpenChange === null || onOpenChange === void 0 || onOpenChange(false);
  }, [onOpenChange]);
  return /*#__PURE__*/_jsx(MenuContext.Provider, {
    value: {
      isOpen,
      open,
      close,
      triggerRef
    },
    children: /*#__PURE__*/_jsx(MenuWrapper, {
      children: children
    })
  });
};
VizExMenu.displayName = 'VizExMenu';
export default VizExMenu;