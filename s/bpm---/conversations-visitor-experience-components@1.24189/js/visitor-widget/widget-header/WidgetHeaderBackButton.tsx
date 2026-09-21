import I18n from 'I18n';
import styled from 'styled-components';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import SVGLeft from 'visitor-ui-component-library-icons/icons/SVGLeft';
import VizExNotificationBadge from 'visitor-ui-component-library/badge/VizExNotificationBadge';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { jsx as _jsx } from "react/jsx-runtime";
const BadgeWrapper = styled(VizExNotificationBadge).withConfig({
  displayName: "WidgetHeaderBackButton__BadgeWrapper"
})(["margin-right:4px;"]);
const ShowThreadsButton = styled(VizExIconButton).withConfig({
  displayName: "WidgetHeaderBackButton__ShowThreadsButton"
})(["", ""], ({
  $focusRingColor
}) => getFocusRingStyles({
  ringColor: $focusRingColor
}));
const WidgetHeaderBackButton = ({
  disabled,
  focusRingColor,
  navigateBack,
  unseenThreadsCountExcludingCurrentThread
}) => {
  const hasNotification = Boolean(unseenThreadsCountExcludingCurrentThread);
  return /*#__PURE__*/_jsx(BadgeWrapper, {
    badgeLabel: unseenThreadsCountExcludingCurrentThread,
    showBadge: hasNotification,
    badgeDescription: I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.badgeDescription'),
    children: /*#__PURE__*/_jsx(ShowThreadsButton, {
      use: "transparent-on-primary",
      onClick: navigateBack,
      "data-test-id": "show-threads-button",
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.showThreadList', {
        unreadThreadCount: unseenThreadsCountExcludingCurrentThread
      }),
      disabled: disabled,
      $focusRingColor: focusRingColor,
      children: /*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(SVGLeft, {}),
        size: "md"
      })
    })
  });
};
WidgetHeaderBackButton.displayName = 'WidgetHeaderBackButton';
export default WidgetHeaderBackButton;