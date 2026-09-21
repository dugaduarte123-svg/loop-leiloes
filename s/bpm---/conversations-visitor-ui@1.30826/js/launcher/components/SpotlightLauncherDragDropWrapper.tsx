import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["isOver", "disabled"];
import { useCallback } from 'react';
import AttachmentUploadDragAndDropWrapper from '../../attachments/components/AttachmentUploadDragAndDropWrapper';
import DragAndDropUploadOverlay from '../../attachments/components/DragAndDropUploadOverlay';
import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const DropZone = styled.div.withConfig({
  displayName: "SpotlightLauncherDragDropWrapper__DropZone"
})(["position:relative;display:flex;flex-direction:column;"]);
const SpotlightDropOverlay = styled(DragAndDropUploadOverlay).withConfig({
  displayName: "SpotlightLauncherDragDropWrapper__SpotlightDropOverlay"
})(["border-radius:24px;&[aria-hidden='false']{border:1px solid ", ";}"], ({
  theme
}) => theme.spotlight.color.border);
const SpotlightLauncherDragDropWrapper = ({
  children,
  disabled,
  onDropFiles,
  containerRef,
  onContainerFocus,
  onContainerBlur
}) => {
  const renderContent = useCallback(_ref => {
    let {
        isOver,
        disabled: isDisabled
      } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);
    return /*#__PURE__*/_jsxs(DropZone, Object.assign({
      ref: containerRef,
      onFocus: onContainerFocus,
      onBlur: onContainerBlur,
      "data-test-id": "spotlight-launcher-drop-zone"
    }, props, {
      children: [children, /*#__PURE__*/_jsx(SpotlightDropOverlay, {
        isOver: isOver,
        disabled: isDisabled,
        hideIcon: true
      })]
    }));
  }, [children, containerRef, onContainerFocus, onContainerBlur]);
  return /*#__PURE__*/_jsx(AttachmentUploadDragAndDropWrapper, {
    onDropFiles: onDropFiles,
    disabled: disabled,
    ignoreDropWhenDefaultPrevented: false,
    children: renderContent
  });
};
SpotlightLauncherDragDropWrapper.displayName = 'SpotlightLauncherDragDropWrapper';
export default SpotlightLauncherDragDropWrapper;