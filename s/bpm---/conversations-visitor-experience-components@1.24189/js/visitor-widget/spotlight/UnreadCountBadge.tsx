import unescapedText from 'I18n/utils/unescapedText';
import styled, { keyframes } from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
const pulse = keyframes(["0%{box-shadow:rgba(255,72,0,0.4) 0px 0px 0px 0px;}70%{box-shadow:rgba(255,72,0,0) 0px 0px 0px 7px;}100%{box-shadow:rgba(255,72,0,0) 0px 0px 0px 0px;}"]);
const Base = styled.div.withConfig({
  displayName: "UnreadCountBadge__Base"
})(["position:absolute;top:0;left:0;transform:translate(-50%,-50%);border-radius:", ";background-color:", ";border:2px solid ", ";animation:", " 2s ease-out infinite;@media (prefers-reduced-motion:reduce){animation:none;}"], ({
  theme
}) => theme.spotlight.borderRadius.pill, ({
  theme
}) => theme.spotlight.color.orange, ({
  theme
}) => theme.spotlight.color.surface, pulse);
const Dot = styled(Base).withConfig({
  displayName: "UnreadCountBadge__Dot"
})(["width:11px;height:11px;"]);
const CountCircle = styled(Base).withConfig({
  displayName: "UnreadCountBadge__CountCircle"
})(["min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:", ";font-weight:", ";color:", ";line-height:1;"], ({
  theme
}) => theme.spotlight.typography.fontSize.xs, ({
  theme
}) => theme.spotlight.typography.fontWeight.semibold, ({
  theme
}) => theme.spotlight.color.surface);
const UnreadCountBadge = ({
  count
}) => {
  if (count <= 1) {
    return /*#__PURE__*/_jsx(Dot, {
      "aria-hidden": "true"
    });
  }
  const label = count > 9 ? '9+' : String(count);
  return /*#__PURE__*/_jsx(CountCircle, {
    "aria-label": unescapedText('conversations-visitor-experience-components.visitorExperienceAriaLabels.unreadMessages', {
      count
    }),
    children: label
  });
};
UnreadCountBadge.displayName = 'UnreadCountBadge';
export default UnreadCountBadge;