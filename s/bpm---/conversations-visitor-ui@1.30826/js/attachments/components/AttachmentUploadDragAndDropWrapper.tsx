import { useCallback, useRef, useState } from 'react';
const cancelDragEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};
const isFilesTypeTransfer = e => {
  var _e$dataTransfer;
  return Array.isArray(e === null || e === void 0 || (_e$dataTransfer = e.dataTransfer) === null || _e$dataTransfer === void 0 ? void 0 : _e$dataTransfer.types) && e.dataTransfer.types.length && e.dataTransfer.types.includes('Files');
};
const AttachmentUploadDragAndDropWrapper = ({
  children,
  disabled = false,
  ignoreDropWhenDefaultPrevented = true,
  onDropFiles
}) => {
  const [isOver, setIsOver] = useState(false);
  const isOverRef = useRef(null);
  const onDragEnter = useCallback(e => {
    e.preventDefault();
    isOverRef.current = e.target;
    if (isFilesTypeTransfer(e)) {
      setIsOver(true);
    }
  }, []);
  const onDragStart = useCallback(e => {
    e.preventDefault();
    if (!isFilesTypeTransfer(e) && e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'none';
    }
  }, []);
  const onDragOver = useCallback(cancelDragEvent, []);
  const onDragLeave = useCallback(e => {
    if (isOverRef.current === e.target) {
      isOverRef.current = null;
      setIsOver(false);
    }
  }, []);
  const onDrop = useCallback(e => {
    setIsOver(false);
    if (ignoreDropWhenDefaultPrevented && e.isDefaultPrevented()) {
      return;
    }
    const files = e.dataTransfer ? e.dataTransfer.files : undefined;
    if (files !== null && files !== void 0 && files.length) {
      e.preventDefault();
      onDropFiles(files);
    }
  }, [onDropFiles, ignoreDropWhenDefaultPrevented]);

  // Must reset isOver on drop — cancelDragEvent alone doesn't clear it,
  // leaving the overlay visible after the user releases the file.
  const onDropDisabled = useCallback(e => {
    setIsOver(false);
    cancelDragEvent(e);
  }, []);
  if (disabled) {
    return children({
      isOver,
      disabled: true,
      onDragEnter,
      onDragLeave,
      onDragOver: cancelDragEvent,
      onDrop: onDropDisabled
    });
  }
  return children({
    isOver,
    disabled: false,
    onDrop,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDragStart
  });
};
AttachmentUploadDragAndDropWrapper.displayName = 'AttachmentUploadDragAndDropWrapper';
export default AttachmentUploadDragAndDropWrapper;