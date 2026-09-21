import styled from 'styled-components';
import unescapedText from 'I18n/utils/unescapedText';
import { getFile } from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import { getFileName } from 'conversations-internal-schema/file-upload/operators/getFileName';
import { fileIsImage } from 'conversations-internal-schema/file-upload/operators/fileIsImage';
import { isUploadCompleted } from 'conversations-internal-schema/file-upload/operators/isUploadCompleted';
import VizExFileAttachment from 'visitor-ui-component-library/file/VizExFileAttachment';
import VizExCloseButton from 'visitor-ui-component-library/button/VizExCloseButton';
import ImageAttachmentPreview from './ImageAttachmentPreview';
import FileIcon from './FileIcon';
import { getFileExtensionLabel } from '../operators/getFileExtensionLabel';
import { jsx as _jsx } from "react/jsx-runtime";
const Chip = styled(VizExFileAttachment).withConfig({
  displayName: "FileUploadChip__Chip"
})(["align-items:center;border-radius:8px;max-width:240px;padding:6px 8px;padding-right:32px;> div{align-items:center;}b{font-size:14px;line-height:18px;}"]);
const ThumbnailPreview = styled(ImageAttachmentPreview).withConfig({
  displayName: "FileUploadChip__ThumbnailPreview"
})(["width:32px;height:32px;border-radius:6px;object-fit:cover;object-position:center;"]);
function FileUploadChip({
  attachment,
  onRemove
}) {
  var _file$type;
  const file = getFile(attachment);
  const isImage = file ? fileIsImage(file) : false;
  const fileName = getFileName(attachment);
  const fileType = getFileExtensionLabel(file);
  const isComplete = isUploadCompleted(attachment);
  const preview = isImage && file ? /*#__PURE__*/_jsx(ThumbnailPreview, {
    imageFile: file,
    alt: ""
  }) : /*#__PURE__*/_jsx(FileIcon, {
    type: (_file$type = file === null || file === void 0 ? void 0 : file.type) !== null && _file$type !== void 0 ? _file$type : ''
  });
  return /*#__PURE__*/_jsx(Chip, {
    role: "group",
    "aria-label": unescapedText('conversations-visitor-ui.stagedAttachment.label', {
      fileName
    }),
    processing: !isComplete,
    fileName: fileName,
    fileInfo: fileType,
    preview: preview,
    "data-test-id": "spotlight-file-upload-chip",
    children: /*#__PURE__*/_jsx(VizExCloseButton, {
      size: "xs",
      onClick: onRemove,
      "aria-label": unescapedText('conversations-visitor-ui.visitorExperienceAriaLabels.removeAttachment', {
        fileName
      })
    })
  });
}
FileUploadChip.displayName = 'FileUploadChip';
export default FileUploadChip;