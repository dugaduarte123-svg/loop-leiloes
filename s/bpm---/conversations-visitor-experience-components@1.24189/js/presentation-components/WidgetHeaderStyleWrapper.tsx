import styled from 'styled-components';
import { HEADER_TEXT_DESCRIPTION_ID, HEADER_TEXT_TITLE_ID } from '../visitor-widget/constants/textIds';
import { getBrandStyle } from '../visitor-widget/util/color';
import { jsx as _jsx } from "react/jsx-runtime";
export const BackgroundPanelContent = styled.header.withConfig({
  displayName: "WidgetHeaderStyleWrapper__BackgroundPanelContent"
})(["border-radius:", ";"], ({
  mobile,
  inline
}) => mobile || inline ? '0' : '8px 8px 0 0');
const FullHeightDiv = styled.nav.withConfig({
  displayName: "WidgetHeaderStyleWrapper__FullHeightDiv"
})(["align-items:center;color:", ";display:flex;height:100%;padding:16px 16px;flex-direction:column;"], ({
  textColor
}) => textColor);
function WidgetHeaderStyleWrapper({
  inline,
  mobile,
  coloring: {
    accentColor,
    textColor
  },
  children
}) {
  return /*#__PURE__*/_jsx(BackgroundPanelContent, {
    style: getBrandStyle(accentColor),
    role: "banner",
    "aria-labelledby": HEADER_TEXT_TITLE_ID,
    "aria-describedby": HEADER_TEXT_DESCRIPTION_ID,
    mobile: mobile,
    inline: inline,
    "data-test-id": "widget-background-panel",
    children: /*#__PURE__*/_jsx(FullHeightDiv, {
      textColor: textColor,
      "data-test-id": "widget-background-panel-div",
      children: children
    })
  });
}
WidgetHeaderStyleWrapper.displayName = 'WidgetHeaderStyleWrapper';
export default WidgetHeaderStyleWrapper;