import styled from 'styled-components';
import { getLocalId } from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import FileUploadChip from './FileUploadChip';
import { jsx as _jsx } from "react/jsx-runtime";
const Wrapper = styled.div.withConfig({
  displayName: "FileUploadChipsList__Wrapper"
})(["display:flex;flex-direction:column;align-items:flex-start;gap:8px;"]);
const FileUploadChipsList = ({
  stagedAttachments,
  onRemoveAttachment
}) => {
  if (!(stagedAttachments !== null && stagedAttachments !== void 0 && stagedAttachments.size)) return null;
  return /*#__PURE__*/_jsx(Wrapper, {
    children: stagedAttachments.map(attachment => /*#__PURE__*/_jsx(FileUploadChip, {
      attachment: attachment,
      onRemove: () => onRemoveAttachment(attachment)
    }, getLocalId(attachment)))
  });
};
FileUploadChipsList.displayName = 'FileUploadChipsList';
export default FileUploadChipsList;