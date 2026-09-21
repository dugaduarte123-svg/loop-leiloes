import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SVGGhost from 'visitor-ui-component-library-icons/icons/SVGGhost';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import VizExSmall from 'visitor-ui-component-library/typography/VizExSmall';
import { NEUTRAL_800, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const Container = styled.div.withConfig({
  displayName: "SpotlightThreadHistoryEmptyState__Container"
})(["display:flex;flex-direction:column;align-items:center;padding:16px 16px;text-align:center;"]);
const Heading = styled.span.withConfig({
  displayName: "SpotlightThreadHistoryEmptyState__Heading"
})(["font-size:12px;font-weight:600;line-height:20px;color:", ";margin-bottom:4px;"], NEUTRAL_1600);
const Subtitle = styled(VizExSmall).withConfig({
  displayName: "SpotlightThreadHistoryEmptyState__Subtitle"
})(["display:block;margin:0;color:", ";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"], NEUTRAL_800);
const SpotlightThreadHistoryEmptyState = () => {
  return /*#__PURE__*/_jsxs(Container, {
    "data-test-id": "spotlight-thread-history-empty-state",
    children: [/*#__PURE__*/_jsx(VizExIcon, {
      icon: /*#__PURE__*/_jsx(SVGGhost, {}),
      size: "24px",
      "aria-hidden": "true",
      style: {
        marginBottom: 8
      }
    }), /*#__PURE__*/_jsx(Heading, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.spotlightThreadHistory.noPreviousThreadsHeading"
      })
    }), /*#__PURE__*/_jsx(Subtitle, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.spotlightThreadHistory.noPreviousThreadsSubtitle"
      })
    })]
  });
};
SpotlightThreadHistoryEmptyState.displayName = 'SpotlightThreadHistoryEmptyState';
export default SpotlightThreadHistoryEmptyState;