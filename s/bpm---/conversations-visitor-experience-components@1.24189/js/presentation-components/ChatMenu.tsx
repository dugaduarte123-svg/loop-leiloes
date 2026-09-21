import { useOverlay } from '@react-aria/overlays';
import { FocusScope } from '@react-aria/focus';
import { useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import SVGVerticalMenu from 'visitor-ui-component-library-icons/icons/SVGVerticalMenu';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { WHITE, NEUTRAL_800, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const MenuTriggerButton = styled(VizExIconButton).withConfig({
  displayName: "ChatMenu__MenuTriggerButton"
})(["font-size:16px;", ""], ({
  $focusRingColor
}) => getFocusRingStyles({
  ringColor: $focusRingColor
}));
const PopoverContainer = styled.div.withConfig({
  displayName: "ChatMenu__PopoverContainer"
})(["position:absolute;top:100%;right:0;margin-top:4px;background-color:", ";border-radius:4px;box-shadow:0 2px 8px rgba(20,20,20,0.25);min-width:120px;z-index:9999;"], WHITE);
const MenuWrapper = styled.div.withConfig({
  displayName: "ChatMenu__MenuWrapper"
})(["position:relative;"]);
const MenuItem = styled.button.withConfig({
  displayName: "ChatMenu__MenuItem"
})(["display:block;width:100%;padding:12px 16px;text-align:left;background:none;border:none;cursor:", ";font-size:14px;color:", ";white-space:nowrap;transition:background-color 0.2s ease;&:hover:not(:disabled){background-color:rgba(0,0,0,0.04);}", ""], ({
  $disabled
}) => $disabled ? 'not-allowed' : 'pointer', ({
  $disabled
}) => $disabled ? NEUTRAL_800 : NEUTRAL_1600, getFocusRingStyles({
  outlineOffset: '-2px'
}));
const ChatMenu = ({
  items,
  focusRingColor,
  menuTriggerAriaLabel,
  menuAriaLabel,
  menuTriggerIcon: TriggerIcon = SVGVerticalMenu,
  triggerSize,
  triggerShape
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const shouldFocusTriggerRef = useRef(false);
  useEffect(() => {
    if (!isOpen && shouldFocusTriggerRef.current) {
      var _triggerRef$current;
      shouldFocusTriggerRef.current = false;
      (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 || _triggerRef$current.focus();
    }
  }, [isOpen]);
  const closeMenu = useCallback(() => {
    shouldFocusTriggerRef.current = true;
    setIsOpen(false);
  }, []);
  const {
    overlayProps
  } = useOverlay({
    isOpen,
    onClose: closeMenu,
    shouldCloseOnBlur: true,
    isDismissable: true
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  popoverRef);
  if (items.length === 0) {
    return null;
  }
  return /*#__PURE__*/_jsxs(MenuWrapper, {
    children: [/*#__PURE__*/_jsx(MenuTriggerButton, {
      ref: triggerRef,
      onClick: () => setIsOpen(true),
      "aria-label": menuTriggerAriaLabel,
      "aria-haspopup": "menu",
      "aria-expanded": isOpen,
      "data-test-id": "header-menu-button",
      use: "transparent-on-primary",
      $focusRingColor: focusRingColor,
      size: triggerSize,
      shape: triggerShape,
      children: /*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(TriggerIcon, {
          height: 20,
          width: 20
        })
      })
    }), isOpen && /*#__PURE__*/_jsx(FocusScope, {
      contain: true,
      autoFocus: true,
      restoreFocus: false,
      children: /*#__PURE__*/_jsx(PopoverContainer, Object.assign({}, overlayProps, {
        ref: popoverRef,
        role: "menu",
        "aria-label": menuAriaLabel,
        children: items.map(item => /*#__PURE__*/_jsx(MenuItem, {
          role: "menuitem",
          "data-test-id": item.testId,
          onClick: item.disabled ? undefined : () => {
            closeMenu();
            item.onClick();
          },
          $disabled: item.disabled,
          disabled: item.disabled,
          "aria-disabled": item.disabled,
          children: item.label
        }, item.id))
      }))
    })]
  });
};
ChatMenu.displayName = 'ChatMenu';
export default ChatMenu;