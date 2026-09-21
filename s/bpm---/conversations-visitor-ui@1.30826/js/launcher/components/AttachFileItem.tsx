import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import SVGAttachment from 'visitor-ui-component-library-icons/icons/SVGAttachment';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import I18n from 'I18n';
import MenuItem from 'conversations-visitor-experience-components/visitor-widget/MenuItem';
import { useFileUpload } from 'conversations-visitor-experience-components/hooks/useFileUpload';
import { getShouldDisableAttachments } from '../../widget-ui/selectors/getShouldDisableAttachments';
// @ts-ignore not typed
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { selectAttachmentFile } from '../../file-uploads/actions/selectAttachmentFile';
import getAllowedFileTypes from '../../file-uploads/util/getAllowedFileTypes';
import { useAppDispatch } from '../../buildStore';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_PORTAL_53 } from '../../file-uploads/constants/fileUploadsConstants';
import { getIsPortal53 } from '../../widget-data/operators/getIsPortal53';
import { TOOLTIP_ARROW_STYLE, TOOLTIP_CONTENT_STYLE, TOOLTIP_CONTENT_STYLE_NARROW } from 'conversations-visitor-message-history/shared/tooltipStyles';
import { NEUTRAL_1600, WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExTooltip from 'visitor-ui-component-library/tooltip/VizExTooltip';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
const AttachFileItem = ({
  onClose,
  disabled = false,
  hasExistingThread = true
}) => {
  const dispatch = useAppDispatch();
  const shouldDisableAttachments = useSelector(getShouldDisableAttachments);
  const selectedThread = useSelector(getSelectedThread);
  const fileAccept = useMemo(() => getAllowedFileTypes(), []);
  const onAttachFile = useCallback(files => {
    if (!(files !== null && files !== void 0 && files.length) || !selectedThread) return;
    const file = files[0];
    if (file) {
      dispatch(selectAttachmentFile({
        file,
        thread: selectedThread,
        source: 'file_upload'
      }));
    }
  }, [dispatch, selectedThread]);
  const {
    handleAttachFileClick,
    renderFileInput
  } = useFileUpload({
    onAttachFile,
    fileAccept
  });
  const handleClick = useCallback(() => {
    onClose();
    handleAttachFileClick();
  }, [onClose, handleAttachFileClick]);
  if (shouldDisableAttachments) return null;
  const maxSize = getIsPortal53() ? MAX_FILE_SIZE_PORTAL_53 : MAX_FILE_SIZE;
  const getTooltipContent = () => {
    if (!hasExistingThread) {
      return I18n.text('conversations-visitor-experience-components.attachmentDisabledTooltip');
    }
    if (disabled) {
      return undefined;
    }
    return I18n.text('conversations-visitor-ui.fileSizeLimit', {
      size: I18n.formatSize(maxSize)
    });
  };
  const tooltipContent = getTooltipContent();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(VizExTooltip, {
      content: tooltipContent,
      placement: "right",
      fullWidth: true,
      backgroundColor: WHITE,
      textColor: NEUTRAL_1600,
      contentStyle: disabled ? TOOLTIP_CONTENT_STYLE_NARROW : TOOLTIP_CONTENT_STYLE,
      arrowStyle: TOOLTIP_ARROW_STYLE,
      children: /*#__PURE__*/_jsxs(MenuItem, {
        role: "menuitem",
        "data-test-id": "spotlight-attach-file",
        $disabled: disabled,
        "aria-disabled": disabled,
        onClick: disabled ? undefined : handleClick,
        children: [/*#__PURE__*/_jsx(VizExIcon, {
          icon: /*#__PURE__*/_jsx(SVGAttachment, {}),
          size: "16px"
        }), I18n.text('conversations-visitor-experience-components.attachFile')]
      })
    }), renderFileInput()]
  });
};
AttachFileItem.displayName = 'AttachFileItem';
export default AttachFileItem;