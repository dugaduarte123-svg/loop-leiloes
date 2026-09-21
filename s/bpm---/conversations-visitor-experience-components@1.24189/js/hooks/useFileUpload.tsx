import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
const HiddenInput = styled.input.withConfig({
  displayName: "useFileUpload__HiddenInput"
})(["display:none;"]);
export const useFileUpload = ({
  onAttachFile,
  onOpen,
  fileAccept = []
}) => {
  const fileInputRef = useRef(null);
  const handleAttachFileClick = useCallback(() => {
    var _fileInputRef$current;
    (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 || _fileInputRef$current.click();
  }, []);
  const handleFileInputChange = useCallback(e => {
    onAttachFile === null || onAttachFile === void 0 || onAttachFile(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpen === null || onOpen === void 0 || onOpen();
  }, [onAttachFile, onOpen]);
  const renderFileInput = () => /*#__PURE__*/_jsx(HiddenInput, {
    ref: fileInputRef,
    type: "file",
    accept: fileAccept.join(','),
    onChange: handleFileInputChange,
    "data-test-id": "spotlight-file-input"
  });
  return {
    handleAttachFileClick,
    renderFileInput
  };
};