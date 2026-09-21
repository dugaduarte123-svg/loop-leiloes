import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useOverlay } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import { useMenuContext } from './VizExMenu';
import { jsx as _jsx } from "react/jsx-runtime";
const ContentWrapper = styled.div.withConfig({
  displayName: "VizExMenuContent__ContentWrapper"
})(["position:absolute;top:100%;", " z-index:9999;"], ({
  $align
}) => $align === 'end' ? 'right: 0;' : 'left: 0;');
const VizExMenuContent = ({
  children,
  align = 'start',
  autoFocus = false,
  'aria-label': ariaLabel,
  'data-test-id': testId
}) => {
  const {
    isOpen,
    close,
    triggerRef
  } = useMenuContext();
  const popoverRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const handleWindowBlur = () => close();
    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, [isOpen, close]);
  const {
    overlayProps
  } = useOverlay({
    isOpen,
    onClose: close,
    shouldCloseOnBlur: true,
    isDismissable: true,
    shouldCloseOnInteractOutside: element => {
      var _triggerRef$current;
      return !((_triggerRef$current = triggerRef.current) !== null && _triggerRef$current !== void 0 && _triggerRef$current.contains(element));
    }
  }, popoverRef);
  const getMenuItems = () => {
    if (!popoverRef.current) return [];
    return Array.from(popoverRef.current.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"]):not(:disabled)'));
  };
  const handleKeyDown = e => {
    var _overlayProps$onKeyDo;
    const {
      key
    } = e;
    (_overlayProps$onKeyDo = overlayProps.onKeyDown) === null || _overlayProps$onKeyDo === void 0 || _overlayProps$onKeyDo.call(overlayProps, e);
    const items = getMenuItems();
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement);
    if (key === 'ArrowDown') {
      e.preventDefault();
      const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      items[next].focus();
    } else if (key === 'ArrowUp') {
      e.preventDefault();
      const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      items[prev].focus();
    } else if (key === 'Home') {
      e.preventDefault();
      items[0].focus();
    } else if (key === 'End') {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  };
  if (!isOpen) return null;
  return /*#__PURE__*/_jsx(FocusScope, {
    autoFocus: autoFocus,
    restoreFocus: false,
    children: /*#__PURE__*/_jsx(ContentWrapper, Object.assign({}, overlayProps, {
      ref: popoverRef,
      role: "menu",
      "aria-label": ariaLabel,
      "data-test-id": testId,
      $align: align,
      onKeyDown: handleKeyDown,
      children: children
    }))
  });
};
VizExMenuContent.displayName = 'VizExMenuContent';
export default VizExMenuContent;