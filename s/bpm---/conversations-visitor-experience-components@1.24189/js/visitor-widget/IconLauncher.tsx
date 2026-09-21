import styled from 'styled-components';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import OpenIcon from './OpenIcon';
import { OBSIDIAN, WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import { launcherHeight, launcherWidth } from './constants/launcherDimensions';
import { useAccessibilityContext } from 'conversations-visitor-message-history/accessibility/AccessibilityContext';
import launcherInteractionStyles from './constants/launcherInteractionStyles';
import TwistFadeTransition from '../presentation-components/TwistFadeTransition';
import CloseIcon from './CloseIcon';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const BaseLauncher = styled.button.withConfig({
  displayName: "IconLauncher__BaseLauncher"
})(["border:none;position:relative;", ""], launcherInteractionStyles);
const ShapedLauncher = styled(BaseLauncher).withConfig({
  displayName: "IconLauncher__ShapedLauncher"
})(["border-radius:50%;height:", "px;width:", "px;"], launcherHeight, launcherWidth);
const LauncherIcon = styled.div.withConfig({
  displayName: "IconLauncher__LauncherIcon"
})(["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;"]);
const IconLauncher = ({
  ariaLabel,
  badgeNumber,
  className,
  onClick,
  showBadge = false,
  style,
  useDefaultColor,
  open
}) => {
  const color = useDefaultColor ? OBSIDIAN : WHITE;
  const icon = /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(TwistFadeTransition, {
      in: open,
      direction: "left",
      children: /*#__PURE__*/_jsx(LauncherIcon, {
        children: /*#__PURE__*/_jsx(CloseIcon, {
          color: color,
          width: 20,
          height: 20
        })
      })
    }), /*#__PURE__*/_jsx(TwistFadeTransition, {
      in: !open,
      direction: "right",
      children: /*#__PURE__*/_jsx(LauncherIcon, {
        children: /*#__PURE__*/_jsx(OpenIcon, {
          color: color,
          width: 32,
          height: 30
        })
      })
    })]
  });
  const {
    setLauncherRef
  } = useAccessibilityContext();
  return /*#__PURE__*/_jsx(VizExNotificationBadge, {
    badgeLabel: badgeNumber,
    showBadge: showBadge,
    positioning: "on-circle",
    children: /*#__PURE__*/_jsx(ShapedLauncher, {
      "aria-label": ariaLabel,
      "aria-haspopup": "dialog",
      isDark: useDefaultColor,
      style: style,
      className: className,
      onClick: onClick,
      ref: setLauncherRef,
      children: icon
    })
  });
};
IconLauncher.displayName = 'IconLauncher';
export default IconLauncher;