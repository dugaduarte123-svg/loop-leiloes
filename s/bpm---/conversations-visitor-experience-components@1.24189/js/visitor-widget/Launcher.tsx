import { useCallback } from 'react';
import I18n from 'I18n';
import styled from 'styled-components';
import { getBrandStyle } from '../visitor-widget/util/color';
import IconLauncher from './IconLauncher';
import classNames from 'classnames';
import { useDetachedWindow } from '../contexts/DetachedWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const IconLauncherWrapper = styled.div.withConfig({
  displayName: "Launcher__IconLauncherWrapper"
})(["display:flex;align-items:center;.launcher-left-align &{flex-direction:row-reverse;}"]);
const DetachedLabel = styled.span.withConfig({
  displayName: "Launcher__DetachedLabel"
})(["font-size:12px;margin:0 8px;"]);
const Launcher = ({
  badgeNumber,
  coloring: {
    accentColor,
    useDefaultColor
  },
  className,
  onClose,
  onOpen,
  open,
  showBadge
}) => {
  const {
    isDetached
  } = useDetachedWindow();
  const handleLaunch = useCallback(() => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  }, [open, onClose, onOpen]);
  const getAriaLabel = () => {
    if (isDetached) {
      return I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.chatOpenInNewWindow');
    }
    if (open) {
      return I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.close');
    }
    return I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.open');
  };
  const commonProps = {
    className: classNames('reagan--widget-loaded', className),
    badgeNumber,
    showBadge,
    ariaLabel: getAriaLabel(),
    onClick: handleLaunch
  };
  return /*#__PURE__*/_jsxs(IconLauncherWrapper, {
    "data-test-id": "icon-launcher",
    children: [isDetached && /*#__PURE__*/_jsx(DetachedLabel, {
      children: I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.chatOpenInNewWindow')
    }), /*#__PURE__*/_jsx(IconLauncher, Object.assign({
      style: getBrandStyle(accentColor),
      useDefaultColor: useDefaultColor,
      open: open
    }, commonProps))]
  });
};
Launcher.displayName = 'Launcher';
export default Launcher;