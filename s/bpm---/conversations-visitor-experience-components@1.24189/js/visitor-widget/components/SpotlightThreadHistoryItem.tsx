import FormattedMessage from 'I18n/components/FormattedMessage';
import styled, { css } from 'styled-components';
import { getTextContentFromHtml } from 'sanitize-text/sanitizers/TextSanitizer';
import SVGAttach from 'visitor-ui-component-library-icons/icons/SVGAttach';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExMenuItem from 'visitor-ui-component-library/menu/VizExMenuItem';
import VizExStatusTag from 'visitor-ui-component-library/tag/VizExStatusTag';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const PreviewText = styled.span.withConfig({
  displayName: "SpotlightThreadHistoryItem__PreviewText"
})(["font-size:14px;line-height:20px;color:", ";white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;", ""], NEUTRAL_1600, ({
  unseenCount
}) => unseenCount > 0 && css(["font-weight:600;"]));
const TimestampText = styled.span.withConfig({
  displayName: "SpotlightThreadHistoryItem__TimestampText"
})(["font-size:14px;line-height:20px;color:", ";white-space:nowrap;flex-shrink:0;margin-left:16px;"], NEUTRAL_1600);
const SpotlightThreadHistoryItem = ({
  formattedTimestamp,
  hasAttachment,
  onClick,
  previewText,
  unseenCount
}) => {
  const plainText = getTextContentFromHtml(previewText);
  const renderPreviewContent = () => {
    if (!hasAttachment) {
      return plainText;
    }
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(VizExIcon, {
        className: "m-right-2",
        icon: /*#__PURE__*/_jsx(SVGAttach, {})
      }), plainText || /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.threadPreview"
      })]
    });
  };
  return /*#__PURE__*/_jsxs(VizExMenuItem, {
    onClick: onClick,
    "data-test-id": "spotlight-thread-history-item",
    children: [unseenCount > 0 && /*#__PURE__*/_jsx(VizExStatusTag, {
      use: "danger",
      "data-test-id": "spotlight-thread-history-item-unread-indicator"
    }), /*#__PURE__*/_jsx(PreviewText, {
      unseenCount: unseenCount,
      children: renderPreviewContent()
    }), /*#__PURE__*/_jsx(TimestampText, {
      children: formattedTimestamp
    })]
  });
};
SpotlightThreadHistoryItem.displayName = 'SpotlightThreadHistoryItem';
export default SpotlightThreadHistoryItem;