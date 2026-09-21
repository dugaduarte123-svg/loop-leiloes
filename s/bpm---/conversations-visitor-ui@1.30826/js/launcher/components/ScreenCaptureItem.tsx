import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import SVGScreenCapture from 'visitor-ui-component-library-icons/icons/SVGScreenCapture';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import I18n from 'I18n';
import MenuItem from 'conversations-visitor-experience-components/visitor-widget/MenuItem';
import { getIsScreenCaptureEnabled } from '../../widget-ui/selectors/getIsScreenCaptureEnabled';
import { getIsMobile } from '../../selectors/getIsMobile';
import { postMessageToParent } from '../../post-message/postMessageToParent';
import { SCREEN_CAPTURE_REQUEST } from '../../constants/PostMessageTypes';
import { TOOLTIP_ARROW_STYLE, TOOLTIP_CONTENT_STYLE_NARROW } from 'conversations-visitor-message-history/shared/tooltipStyles';
import { NEUTRAL_1600, WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExTooltip from 'visitor-ui-component-library/tooltip/VizExTooltip';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const ScreenCaptureItem = ({
  onClose,
  disabled = false,
  hasExistingThread = true
}) => {
  const screenCaptureEnabled = useSelector(getIsScreenCaptureEnabled);
  const mobile = useSelector(getIsMobile);
  const supportsScreenCapture = useMemo(() => navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function' && !mobile, [mobile]);
  const handleClick = useCallback(() => {
    postMessageToParent(SCREEN_CAPTURE_REQUEST);
    onClose();
  }, [onClose]);
  if (!screenCaptureEnabled || !supportsScreenCapture) return null;
  const tooltipContent = !hasExistingThread ? I18n.text('conversations-visitor-experience-components.screenshotDisabledTooltip') : undefined;
  return /*#__PURE__*/_jsx(VizExTooltip, {
    content: tooltipContent,
    placement: "right",
    backgroundColor: WHITE,
    textColor: NEUTRAL_1600,
    contentStyle: TOOLTIP_CONTENT_STYLE_NARROW,
    arrowStyle: TOOLTIP_ARROW_STYLE,
    fullWidth: true,
    children: /*#__PURE__*/_jsxs(MenuItem, {
      role: "menuitem",
      "data-test-id": "spotlight-screen-capture",
      $disabled: disabled,
      "aria-disabled": disabled,
      onClick: disabled ? undefined : handleClick,
      children: [/*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(SVGScreenCapture, {}),
        size: "16px"
      }), I18n.text('conversations-visitor-experience-components.screenCapture')]
    })
  });
};
ScreenCaptureItem.displayName = 'ScreenCaptureItem';
export default ScreenCaptureItem;