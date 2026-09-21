import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["badgeDescription", "positioning", "badgeLabel", "children", "showBadge"];
import styled, { css } from 'styled-components';
import { getNotificationBackgroundColor } from './theme/notificationThemeOperators';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const badgeMargin = ({
  showBadge,
  positioning
}) => {
  return showBadge && positioning !== 'on-circle' && css(["margin-right:14px;"]);
};
const Wrapper = styled.div.withConfig({
  displayName: "VizExNotificationBadge__Wrapper"
})(["position:relative;display:inline-flex;align-items:baseline;", ";line-height:1;"], badgeMargin);
const getVariationStyles = ({
  positioning
}) => positioning === 'on-circle' ? css(["left:75%;top:5%;"]) : css(["right:-12px;top:-4px;"]);
const CountBadge = styled.span.withConfig({
  displayName: "VizExNotificationBadge__CountBadge"
})(["background-color:", ";border:1px solid white;box-shadow:0 0 0 1px white;display:inline;pointer-events:none;text-align:center;font-size:11px;vertical-align:baseline;border-radius:500px;color:white;padding:1px 4px;position:absolute;", ";"], ({
  theme
}) => getNotificationBackgroundColor(theme), getVariationStyles);
const VizExNotificationBadge = _ref => {
  let {
      badgeDescription = 'notifications',
      positioning = 'default',
      badgeLabel,
      children,
      showBadge
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsxs(Wrapper, Object.assign({}, rest, {
    showBadge: showBadge,
    positioning: positioning,
    children: [children, showBadge && /*#__PURE__*/_jsx(CountBadge, {
      "aria-label": badgeDescription,
      positioning: positioning,
      children: badgeLabel
    })]
  }));
};
VizExNotificationBadge.displayName = 'VizExNotificationBadge';
export default VizExNotificationBadge;