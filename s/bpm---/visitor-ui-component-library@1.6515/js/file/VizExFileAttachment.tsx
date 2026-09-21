import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["processing", "preview", "fileName", "fileInfo", "children", "theme"];
import styled, { css } from 'styled-components';
import { getFileAttachmentBackgroundColor, getFileAttachmentBorderColor, getFileAttachmentTextColor, getFileAttachmentProcessingTextColor, getFileAttachmentProcessingBackgroundColor } from './theme/fileAttachmentThemeOperators';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const getProcessingStyles = ({
  theme
}) => css(["color:", ";background-color:", ";"], getFileAttachmentProcessingTextColor(theme), getFileAttachmentProcessingBackgroundColor(theme));
const AttachmentWrapper = styled.div.withConfig({
  displayName: "VizExFileAttachment__AttachmentWrapper"
})(["display:flex;font-size:12px;padding:12px;padding-right:32px;border-radius:3px;position:relative;max-width:100%;flex-direction:row;background-color:", ";border:1px solid ", ";color:", ";", ";"], () => getFileAttachmentBackgroundColor(), () => getFileAttachmentBorderColor(), ({
  theme
}) => getFileAttachmentTextColor(theme), ({
  theme,
  processing
}) => processing && getProcessingStyles({
  theme
}));
const ContentWrapper = styled.div.withConfig({
  displayName: "VizExFileAttachment__ContentWrapper"
})(["display:flex;position:relative;max-width:100%;> *:nth-child(2){padding-left:12px;}"]);
const PreviewWrapper = styled.div.withConfig({
  displayName: "VizExFileAttachment__PreviewWrapper"
})(["overflow-y:hidden;overflow-x:hidden;align-items:center;display:flex;flex-basis:auto;justify-content:center;flex-shrink:0;font-size:32px;max-height:32px;width:32px;"]);
const FileInfoWrapper = styled.div.withConfig({
  displayName: "VizExFileAttachment__FileInfoWrapper"
})(["flex-grow:1;flex-shrink:0;flex-basis:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;@media all and (-ms-high-contrast:none){flex-basis:auto;max-width:100%;padding-right:12px;}"]);
const FileName = styled.b.withConfig({
  displayName: "VizExFileAttachment__FileName"
})(["font-weight:600;font-size:12px;line-height:12px;"]);
const FileInfo = styled.div.withConfig({
  displayName: "VizExFileAttachment__FileInfo"
})(["font-size:12px;line-height:12px;"]);
const VizExFileAttachment = props => {
  const {
      processing,
      preview,
      fileName,
      fileInfo,
      children,
      theme
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsxs(AttachmentWrapper, Object.assign({}, rest, {
    theme: theme,
    processing: processing,
    children: [children, /*#__PURE__*/_jsxs(ContentWrapper, {
      children: [preview && /*#__PURE__*/_jsx(PreviewWrapper, {
        children: preview
      }), /*#__PURE__*/_jsxs(FileInfoWrapper, {
        children: [/*#__PURE__*/_jsx(FileName, {
          children: fileName
        }), /*#__PURE__*/_jsx(FileInfo, {
          children: fileInfo
        })]
      })]
    })]
  }));
};
VizExFileAttachment.displayName = 'VizExFileAttachment';
export default VizExFileAttachment;