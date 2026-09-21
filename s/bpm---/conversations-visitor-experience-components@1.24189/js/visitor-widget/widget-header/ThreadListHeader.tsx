import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGMessages from 'visitor-ui-component-library-icons/icons/SVGMessages';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import { HEADER_TEXT_TITLE_ID } from '../constants/textIds';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export const HeaderWrapper = styled.div.withConfig({
  displayName: "ThreadListHeader__HeaderWrapper"
})(["align-items:center;display:flex;justify-content:space-between;width:100%;"]);
const NewThreadButton = styled(VizExIconButton).withConfig({
  displayName: "ThreadListHeader__NewThreadButton"
})(["", ""], ({
  $focusRingColor
}) => getFocusRingStyles({
  ringColor: $focusRingColor
}));
export default function ThreadListHeader({
  createNewThread,
  customHeaderText = undefined,
  focusRingColor,
  showCreateThreadButton,
  textColor
}) {
  return /*#__PURE__*/_jsxs(HeaderWrapper, {
    children: [/*#__PURE__*/_jsx("h4", {
      "aria-level": 1,
      style: {
        textAlign: 'center',
        color: textColor
      },
      className: "m-bottom-0",
      id: HEADER_TEXT_TITLE_ID,
      "data-test-id": HEADER_TEXT_TITLE_ID,
      children: customHeaderText !== null && customHeaderText !== void 0 ? customHeaderText : /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.visitorWidget.header.threadListTitle"
      })
    }), showCreateThreadButton ? /*#__PURE__*/_jsx(NewThreadButton, {
      onClick: createNewThread,
      "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.createNewThread'),
      "data-test-id": "new-thread-button",
      use: "transparent-on-primary",
      $focusRingColor: focusRingColor,
      children: /*#__PURE__*/_jsx(VizExIcon, {
        icon: /*#__PURE__*/_jsx(SVGMessages, {
          style: {
            height: '24px',
            width: '24px'
          }
        })
      })
    }) : null]
  });
}
ThreadListHeader.displayName = 'ThreadListHeader';