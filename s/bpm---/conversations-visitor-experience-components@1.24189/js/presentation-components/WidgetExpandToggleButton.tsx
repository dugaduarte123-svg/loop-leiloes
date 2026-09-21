import I18n from 'I18n';
import styled, { css } from 'styled-components';
import SVGResizeCollapse from 'visitor-ui-component-library-icons/icons/SVGResizeCollapse';
import SVGResizeExpand from 'visitor-ui-component-library-icons/icons/SVGResizeExpand';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { useWidgetResizeContext } from '../contexts/WidgetResizeContext';
import { jsx as _jsx } from "react/jsx-runtime";
const focusRingOverride = css(["", ""], ({
  theme
}) => getFocusRingStyles({
  ringColor: theme.colors.textOnPrimary
}));
const ExpandToggleButton = styled(VizExIconButton).withConfig({
  displayName: "WidgetExpandToggleButton__ExpandToggleButton"
})(["font-size:16px;", ""], focusRingOverride);
export default function WidgetExpandToggleButton({
  className
}) {
  const {
    isResizeEnabled,
    isExpanded,
    onToggleExpand
  } = useWidgetResizeContext();
  if (!isResizeEnabled) return null;
  return /*#__PURE__*/_jsx(ExpandToggleButton, {
    className: className,
    onClick: onToggleExpand,
    use: "transparent-on-primary",
    "aria-label": isExpanded ? I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.collapseWidget') : I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.expandWidget'),
    "data-test-id": "widget-expand-toggle-button",
    children: /*#__PURE__*/_jsx(VizExIcon, {
      icon: isExpanded ? /*#__PURE__*/_jsx(SVGResizeCollapse, {}) : /*#__PURE__*/_jsx(SVGResizeExpand, {}),
      size: "md"
    })
  });
}
WidgetExpandToggleButton.displayName = 'WidgetExpandToggleButton';