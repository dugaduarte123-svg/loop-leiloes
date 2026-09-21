import styled from 'styled-components';
import SVGArrowUp from 'visitor-ui-component-library-icons/icons/SVGArrowUp';
import { NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { darken, lighten } from 'visitor-ui-component-library/utils/colors';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
export const MAX_TEXTAREA_HEIGHT = 200;
const textareaBaseStyles = `
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  padding: 2px 0;
  word-break: break-word;
  white-space: pre-wrap;
  max-height: ${MAX_TEXTAREA_HEIGHT}px;
`;
export const IconButton = styled.button.withConfig({
  displayName: "LauncherContent__IconButton"
})(["width:28px;height:28px;border-radius:50%;background-color:", ";border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;padding:0;color:", ";transition:background-color 150ms ease,color 150ms ease;&:hover{background-color:", ";}&:disabled{pointer-events:none;}"], ({
  $active
}) => $active ? NEUTRAL_1600 : '#f0f0f0', ({
  $active
}) => $active ? 'white' : 'inherit', ({
  $active
}) => $active ? lighten(NEUTRAL_1600, 0.15) : darken('#f0f0f0', 0.15));
const SendIconButton = styled(IconButton).withConfig({
  displayName: "LauncherContent__SendIconButton"
})([""]);
const TextareaWrapper = styled.div.withConfig({
  displayName: "LauncherContent__TextareaWrapper"
})(["display:grid;flex:1;min-width:0;&::after{content:attr(data-value) ' ';visibility:hidden;overflow:hidden;grid-area:1 / 1;", "}"], textareaBaseStyles);
const InputRow = styled.div.withConfig({
  displayName: "LauncherContent__InputRow"
})(["display:flex;align-items:center;gap:8px;width:100%;padding-left:", ";", ""], ({
  $hasAddMenu
}) => $hasAddMenu ? '0' : '8px', ({
  $isMultiLine
}) => $isMultiLine && `
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto auto;

      ${TextareaWrapper} {
        grid-column: 1 / -1;
        grid-row: 1;
        padding: 0 8px;
      }

      ${SendIconButton} {
        grid-column: 3;
        grid-row: 2;
        justify-self: end;
      }

      > *:not(${TextareaWrapper}):not(${SendIconButton}) {
        grid-column: 1;
        grid-row: 2;
      }
    `);
const Textarea = styled.textarea.withConfig({
  displayName: "LauncherContent__Textarea"
})(["background:transparent;border:none;outline:none;width:100%;color:", ";resize:none;overflow-y:hidden;max-height:", "px;grid-area:1 / 1;", " &:focus,&:focus-visible{box-shadow:none;outline:none;}&::placeholder{color:#666;}&:disabled{cursor:not-allowed;}"], NEUTRAL_1600, MAX_TEXTAREA_HEIGHT, textareaBaseStyles);
const PlaceholderText = styled.span.withConfig({
  displayName: "LauncherContent__PlaceholderText"
})(["flex:1;padding-left:8px;font-size:14px;font-weight:400;line-height:24px;color:#666;"]);
const ValidationMessage = styled.p.withConfig({
  displayName: "LauncherContent__ValidationMessage"
})(["margin:0 -8px -10px;padding:8px 12px;display:flex;align-items:center;gap:4px;font-size:14px;font-weight:400;line-height:20px;color:#33475b;background:#fcece9;border-radius:0 0 23px 23px;"]);
const SendIconVisual = styled.div.withConfig({
  displayName: "LauncherContent__SendIconVisual"
})(["width:28px;height:28px;border-radius:50%;background-color:#f0f0f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:", ";"], NEUTRAL_1600);
function LauncherContent({
  isButton,
  isMultiLine,
  validationMessage,
  buttonLabel,
  addMenu,
  fileUploads,
  inputRef,
  placeholder,
  messageText,
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  disabled,
  canSubmit,
  hasTextContent,
  hasAttachments,
  onSubmit,
  sendAriaLabel
}) {
  if (isButton) {
    return /*#__PURE__*/_jsxs(InputRow, {
      children: [/*#__PURE__*/_jsx(PlaceholderText, {
        children: buttonLabel
      }), /*#__PURE__*/_jsx(SendIconVisual, {
        "aria-hidden": "true",
        children: /*#__PURE__*/_jsx(VizExIcon, {
          size: "14px",
          icon: /*#__PURE__*/_jsx(SVGArrowUp, {})
        })
      })]
    });
  }
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [fileUploads, /*#__PURE__*/_jsxs(InputRow, {
      $isMultiLine: isMultiLine,
      $hasAddMenu: Boolean(addMenu),
      children: [addMenu, /*#__PURE__*/_jsx(TextareaWrapper, {
        "data-value": messageText,
        children: /*#__PURE__*/_jsx(Textarea, {
          ref: inputRef,
          placeholder: placeholder,
          onKeyDown: onKeyDown,
          value: messageText,
          onChange: onChange,
          onFocus: onFocus,
          onBlur: onBlur,
          "aria-label": placeholder,
          "aria-invalid": Boolean(validationMessage),
          rows: 1,
          disabled: disabled
        })
      }), /*#__PURE__*/_jsx(SendIconButton, {
        $active: canSubmit && (hasTextContent || hasAttachments),
        "aria-pressed": canSubmit && (hasTextContent || hasAttachments),
        onClick: onSubmit,
        "aria-label": sendAriaLabel,
        "data-test-id": "arrow-up-icon",
        disabled: !canSubmit,
        children: /*#__PURE__*/_jsx(VizExIcon, {
          size: "14px",
          icon: /*#__PURE__*/_jsx(SVGArrowUp, {})
        })
      })]
    }), validationMessage && /*#__PURE__*/_jsx(ValidationMessage, {
      role: "alert",
      children: validationMessage
    })]
  });
}
LauncherContent.displayName = 'LauncherContent';
export default LauncherContent;