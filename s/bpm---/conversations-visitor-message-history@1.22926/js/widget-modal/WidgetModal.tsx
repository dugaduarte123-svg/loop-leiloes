import { useButton } from '@react-aria/button';
import { FocusScope } from '@react-aria/focus';
import I18n from 'I18n';
import { useRef } from 'react';
import useWidgetOverlay from './useWidgetOverlay';
import styled from 'styled-components';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import { NEUTRAL_900, OBSIDIAN, WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { hexToRgba } from 'visitor-ui-component-library/utils/hexToRgba';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const DEFAULT_OVERLAY_COLOR = hexToRgba(NEUTRAL_900, 0.3);
const DEFAULT_BACKGROUND_COLOR = WHITE;
const UPDATED_VISITOR_WIDGET_BORDER_RADIUS = 10;
const BASE_MODAL_PADDING = 20;
const CLOSE_BUTTON_SIZE = 32;
const CLOSE_BUTTON_ICON_SIZE = 12;
const CLOSE_BUTTON_PADDING = (CLOSE_BUTTON_SIZE - CLOSE_BUTTON_ICON_SIZE) / 2;
const ModalWrapper = styled.div.withConfig({
  displayName: "WidgetModal__ModalWrapper"
})(["position:absolute;top:0;left:0;width:100%;height:100%;background-color:", ";display:flex;align-items:end;z-index:1000;border-radius:", "px;"], ({
  $overlayColor
}) => $overlayColor, UPDATED_VISITOR_WIDGET_BORDER_RADIUS);
const ModalBody = styled.div.withConfig({
  displayName: "WidgetModal__ModalBody"
})(["background-color:", ";border-radius:8px;max-width:100%;width:100%;max-height:50%;overflow:auto;"], ({
  $backgroundColor
}) => $backgroundColor);
const ModalHeader = styled.div.withConfig({
  displayName: "WidgetModal__ModalHeader"
})(["display:flex;justify-content:space-between;background-color:", ";padding:", "px ", "px 0 ", "px;"], ({
  $backgroundColor
}) => $backgroundColor, BASE_MODAL_PADDING, CLOSE_BUTTON_PADDING, BASE_MODAL_PADDING);
const CloseButton = styled(VizExIconButton).withConfig({
  displayName: "WidgetModal__CloseButton"
})(["flex:0;width:", "px;height:", "px;font-size:", "px;padding:", "px;color:", ";background-color:", ";"], CLOSE_BUTTON_SIZE, CLOSE_BUTTON_SIZE, CLOSE_BUTTON_ICON_SIZE, CLOSE_BUTTON_PADDING, OBSIDIAN, ({
  $backgroundColor
}) => $backgroundColor);
const ModalContent = styled.div.withConfig({
  displayName: "WidgetModal__ModalContent"
})(["padding:0 ", "px ", "px ", "px;background-color:", ";"], BASE_MODAL_PADDING, BASE_MODAL_PADDING, BASE_MODAL_PADDING, ({
  $backgroundColor
}) => $backgroundColor);
const WidgetModal = ({
  isOpen,
  onClose,
  modalContent
}) => {
  const {
    overlayProps,
    underlayProps,
    dialogProps,
    dialogRef: ref
  } = useWidgetOverlay({
    isOpen,
    onClose,
    id: 'live-chat-widget-modal'
  });
  const buttonRef = useRef(null);
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  const {
    buttonProps
  } = useButton({
    onPress: onClose
  }, buttonRef);
  const {
    colorOverrides
  } = modalContent || {};
  if (!isOpen || !modalContent) {
    return null;
  }
  return /*#__PURE__*/_jsx(ModalWrapper, Object.assign({}, underlayProps, {
    $overlayColor: (colorOverrides === null || colorOverrides === void 0 ? void 0 : colorOverrides.overlayColor) || DEFAULT_OVERLAY_COLOR,
    children: /*#__PURE__*/_jsx(FocusScope, {
      contain: true,
      restoreFocus: true,
      autoFocus: true,
      children: /*#__PURE__*/_jsxs(ModalBody, Object.assign({}, overlayProps, dialogProps, {
        ref: ref,
        $backgroundColor: DEFAULT_BACKGROUND_COLOR,
        children: [/*#__PURE__*/_jsxs(ModalHeader, {
          $backgroundColor: (colorOverrides === null || colorOverrides === void 0 ? void 0 : colorOverrides.headerBackgroundColor) || DEFAULT_BACKGROUND_COLOR,
          children: [modalContent.headerContent ? modalContent.headerContent : null, /*#__PURE__*/_jsx(CloseButton, Object.assign({}, buttonProps, {
            "data-test-id": "modal-close-button",
            onClick: onClose,
            use: "primary-transparent-background",
            "aria-label": I18n.text('conversations-visitor-experience-components.widgetModal.close'),
            $backgroundColor: (colorOverrides === null || colorOverrides === void 0 ? void 0 : colorOverrides.headerBackgroundColor) || DEFAULT_BACKGROUND_COLOR,
            children: /*#__PURE__*/_jsx(VizExIcon, {
              icon: /*#__PURE__*/_jsx(SVGClose, {})
            })
          }))]
        }), /*#__PURE__*/_jsx(ModalContent, {
          $backgroundColor: (colorOverrides === null || colorOverrides === void 0 ? void 0 : colorOverrides.contentBackgroundColor) || DEFAULT_BACKGROUND_COLOR,
          children: modalContent.bodyContent ? modalContent.bodyContent : null
        })]
      }))
    })
  }));
};
WidgetModal.displayName = 'WidgetModal';
export default WidgetModal;