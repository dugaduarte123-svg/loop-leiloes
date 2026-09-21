import I18n from 'I18n';
import styled from 'styled-components';
import { UPDATED_VISITOR_WIDGET_BORDER_RADIUS } from 'conversations-visitor-experience-components/widget-dimensions/constants/dimensions';
import { WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGAttachment from 'visitor-ui-component-library-icons/icons/SVGAttachment';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const Overlay = styled.div.withConfig({
  displayName: "DragAndDropUploadOverlay__Overlay"
})(["position:absolute;", " transition:background 0.2s;z-index:99;border-bottom-left-radius:", "px;border-bottom-right-radius:", "px;display:flex;flex-direction:column;justify-content:center;align-items:center;pointer-events:none;top:0;bottom:0;left:0;right:0;"], ({
  $isOver
}) => $isOver && `background-color: rgba(45, 62, 80, 0.75);
     backdrop-filter: blur(2px);`, UPDATED_VISITOR_WIDGET_BORDER_RADIUS, UPDATED_VISITOR_WIDGET_BORDER_RADIUS);
const OverlayContent = styled.div.withConfig({
  displayName: "DragAndDropUploadOverlay__OverlayContent"
})(["display:flex;flex-direction:column;align-items:center;gap:8px;color:", ";font-size:14px;font-weight:500;text-align:center;padding:0 16px;overflow-wrap:anywhere;"], WHITE);
const DragAndDropUploadOverlay = ({
  isOver,
  disabled = false,
  hideIcon = false,
  className
}) => {
  if (!isOver) {
    return /*#__PURE__*/_jsx(Overlay, {
      $isOver: false,
      className: className,
      role: "status",
      "aria-live": "polite",
      "aria-atomic": "true",
      "aria-hidden": true
    });
  }
  return /*#__PURE__*/_jsx(Overlay, {
    $isOver: true,
    className: className,
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true",
    "aria-hidden": false,
    children: /*#__PURE__*/_jsxs(OverlayContent, {
      children: [!disabled && !hideIcon && /*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(SVGAttachment, {}),
        size: "24px"
      }), disabled ? I18n.text('conversations-visitor-ui.attachments.dropUnavailable') : I18n.text('conversations-visitor-ui.attachments.dropToAttach')]
    })
  });
};
DragAndDropUploadOverlay.displayName = 'DragAndDropUploadOverlay';
export default DragAndDropUploadOverlay;