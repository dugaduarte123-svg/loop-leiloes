import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SVGAdd from 'visitor-ui-component-library-icons/icons/SVGAdd';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import I18n from 'I18n';
import SpotlightLauncherShell, { IconButton } from 'conversations-visitor-experience-components/visitor-widget/SpotlightLauncherShell';
import SpotlightAddMenu from 'conversations-visitor-experience-components/visitor-widget/SpotlightAddMenu';
import FileUploadChipsList from '../../attachments/components/FileUploadChipsList';
import SpotlightLauncherDragDropWrapper from './SpotlightLauncherDragDropWrapper';
import ScreenCaptureItem from './ScreenCaptureItem';
import AttachFileItem from './AttachFileItem';
// @ts-ignore not typed
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { getThreadsAsyncData } from '../../threads/selectors/getThreadsAsyncData';
import { isSucceeded } from '../../constants/asyncStatuses';
// @ts-ignore not typed
import { getFileUploadListForCurrentThreadId } from '../../file-uploads/selectors/getFileUploadListForCurrentThreadId';
// @ts-ignore not typed
import { removeAttachmentFromThread } from '../../file-uploads/actions/removeAttachmentFromThread';
import { isUploadCompleted } from 'conversations-internal-schema/file-upload/operators/isUploadCompleted';
import { useAppDispatch, useAppSelector } from '../../buildStore';
import { publishMessageFromSpotlightLauncher } from '../../actions/publishMessageFromSpotlightLauncher';
import { useConsentPromptDataV2 } from '../../hooks/useConsentPromptDataV2';
import { isPersistedThread } from '../../threads/operators/isPersistedThread';
import { getIsThreadInactive } from '../../threads/selectors/getIsThreadInactive';
import { getShouldDisableInputForConversation } from '../../selectors/getShouldDisableInputForConversation';
import { getIsPublishingBlocked } from '../../selectors/getIsPublishingBlocked';
import { useTrackComposerDisabledMetric } from '../../usage-tracking/hooks/useTrackComposerDisabledMetric';
import { hasPersistedThreads as hasPersistedThreadsSelector } from '../../threads/selectors/hasPersistedThreads';
import { handleSpotlightMenuResize } from '../../post-message/handleSpotlightMenuResize';
import { canUploadAttachments as canUploadAttachmentsSelector } from '../../attachments/selectors/canUploadAttachments';
import { dropAttachmentFile } from '../../file-uploads/actions/dropAttachmentFile';
import { useShowSdrPrompts } from '../../ai/spotlight-sdr-prompts/useShowSdrPrompts';
import { useSpotlightGlowColor } from '../../hooks/useSpotlightGlowColor';
import SpotlightQuickPrompts from '../../spotlight/quick-prompts/SpotlightQuickPrompts';
import SpotlightThemeProvider from 'conversations-visitor-experience-components/visitor-widget/spotlight/SpotlightThemeProvider';
import NewMessagePreviewPopupContainer from '../../spotlight/message-preview/NewMessagePreviewPopupContainer';
import { dismissNewMessagePreviewPopup } from '../../spotlight/message-preview/reducers/newMessagePreviewPopupSlice';
import { useSyncSpotlightLauncherHeight } from 'conversations-visitor-experience-components/hooks/useSyncSpotlightLauncherHeight';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
const SpotlightLauncher = ({
  onOpen,
  onClose,
  open = false,
  browserWindowWidth
}) => {
  const dispatch = useAppDispatch();
  const selectedThread = useSelector(getSelectedThread);
  const threadsAsyncData = useSelector(getThreadsAsyncData);
  const areThreadsLoaded = isSucceeded(threadsAsyncData);
  const hasExistingThread = isPersistedThread(selectedThread);
  const isThreadInactive = useSelector(getIsThreadInactive);
  const shouldDisableInputForConversation = useAppSelector(getShouldDisableInputForConversation);
  const isPublishingBlocked = useAppSelector(getIsPublishingBlocked);
  const hasAnyPersistedThreads = useSelector(hasPersistedThreadsSelector);
  const canUpload = useSelector(state => selectedThread ? canUploadAttachmentsSelector(state, {
    thread: selectedThread
  }) : false);
  const {
    consentRequired: requiresConsent,
    showConsentButton: requiresExplicitConsent
  } = useConsentPromptDataV2();
  const stagedAttachments = useSelector(getFileUploadListForCurrentThreadId);
  const menuOpenExpandedRef = useRef(false);
  const isInputExpandedRef = useRef(false);
  const launcherAreaRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useSyncSpotlightLauncherHeight(launcherAreaRef, open || areThreadsLoaded);
  const hasUploadInProgress = (stagedAttachments === null || stagedAttachments === void 0 ? void 0 : stagedAttachments.size) > 0 && !stagedAttachments.every(isUploadCompleted);
  const areAttachActionsDisabled = !hasExistingThread || !canUpload;
  const {
    showPrompts,
    isCollapsedButton,
    collapsePrompts
  } = useShowSdrPrompts({
    open,
    hasExistingThread,
    hasAnyPersistedThreads,
    requiresConsent
  });
  const glowColor = useSpotlightGlowColor();
  const isButton = !open && (hasExistingThread || hasAnyPersistedThreads || requiresConsent || shouldDisableInputForConversation || isCollapsedButton);
  const isInputDisabled = shouldDisableInputForConversation || isPublishingBlocked || requiresExplicitConsent || isThreadInactive;
  useTrackComposerDisabledMetric('spotlight', isInputDisabled, open && !requiresConsent);
  const onDropFiles = useCallback(files => {
    if (!open) {
      onOpen();
    }
    if (!selectedThread) return;
    dispatch(dropAttachmentFile(files, selectedThread));
  }, [dispatch, onOpen, open, selectedThread]);
  const onSubmitMessage = useCallback(text => {
    dispatch(publishMessageFromSpotlightLauncher(text));
  }, [dispatch]);
  const onRemoveAttachment = useCallback(attachment => {
    if (!selectedThread) return;
    dispatch(removeAttachmentFromThread({
      attachment,
      thread: selectedThread
    }));
  }, [dispatch, selectedThread]);
  const closeMenu = useCallback(() => {
    menuOpenExpandedRef.current = false;
    setMenuOpen(false);
    if (!open) handleSpotlightMenuResize(false);
  }, [open]);
  const openMenu = useCallback(() => {
    setMenuOpen(true);
    if (!open) handleSpotlightMenuResize(true);
  }, [open]);
  const handleAddButtonClick = useCallback(e => {
    e.stopPropagation();
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [menuOpen, closeMenu, openMenu]);
  const handleExpandedChange = useCallback(expanded => {
    isInputExpandedRef.current = expanded;
    if (!expanded) menuOpenExpandedRef.current = false;
    if (expanded) dispatch(dismissNewMessagePreviewPopup());
  }, [dispatch]);
  const handleLauncherBlur = useCallback(e => {
    var _launcherAreaRef$curr;
    if (!((_launcherAreaRef$curr = launcherAreaRef.current) !== null && _launcherAreaRef$curr !== void 0 && _launcherAreaRef$curr.contains(e.relatedTarget))) {
      collapsePrompts();
    }
  }, [collapsePrompts]);
  const placeholder = requiresExplicitConsent ? I18n.text('conversations-visitor-experience-components.chatTextArea.placeholderConsentRequired') : I18n.text('conversations-visitor-experience-components.spotlightLauncher.placeholder');
  const sendAriaLabel = I18n.text('conversations-visitor-experience-components.spotlightLauncher.sendMessage');
  const moreOptionsAriaLabel = I18n.text('conversations-visitor-experience-components.spotlightLauncher.moreOptions');
  const buttonLabel = hasExistingThread || hasAnyPersistedThreads ? I18n.text('conversations-visitor-experience-components.spotlightLauncher.continueConversation') : I18n.text('conversations-visitor-experience-components.spotlightLauncher.placeholder');
  if (!open && !areThreadsLoaded) return null;
  const fileUploads = stagedAttachments !== null && stagedAttachments !== void 0 && stagedAttachments.size ? /*#__PURE__*/_jsx(FileUploadChipsList, {
    stagedAttachments: stagedAttachments,
    onRemoveAttachment: onRemoveAttachment
  }) : null;
  const addMenu = /*#__PURE__*/_jsxs(SpotlightAddMenu, {
    trigger: /*#__PURE__*/_jsx(IconButton, {
      onPointerDown: e => e.stopPropagation(),
      onMouseDown: e => {
        e.preventDefault();
        menuOpenExpandedRef.current = open || isInputExpandedRef.current;
      },
      onClick: handleAddButtonClick,
      "aria-label": moreOptionsAriaLabel,
      "aria-haspopup": "menu",
      "aria-expanded": menuOpen,
      "data-test-id": "add-icon",
      disabled: isInputDisabled,
      children: /*#__PURE__*/_jsx(VizExIcon, {
        size: "14px",
        icon: /*#__PURE__*/_jsx(SVGAdd, {})
      })
    }),
    isOpen: menuOpen,
    onClose: closeMenu,
    children: [/*#__PURE__*/_jsx(ScreenCaptureItem, {
      onClose: closeMenu,
      disabled: areAttachActionsDisabled,
      hasExistingThread: hasExistingThread
    }), /*#__PURE__*/_jsx(AttachFileItem, {
      onClose: closeMenu,
      disabled: areAttachActionsDisabled,
      hasExistingThread: hasExistingThread
    })]
  });
  return /*#__PURE__*/_jsx(SpotlightThemeProvider, {
    children: /*#__PURE__*/_jsx(SpotlightLauncherDragDropWrapper, {
      onDropFiles: onDropFiles,
      disabled: areAttachActionsDisabled,
      containerRef: launcherAreaRef,
      onContainerBlur: handleLauncherBlur,
      children: /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(NewMessagePreviewPopupContainer, {
          onOpen: onOpen,
          browserWindowWidth: browserWindowWidth
        }), /*#__PURE__*/_jsx(SpotlightLauncherShell, {
          browserWindowWidth: browserWindowWidth,
          placeholder: placeholder,
          sendAriaLabel: sendAriaLabel,
          onSubmit: onSubmitMessage,
          onOpen: onOpen,
          onClose: onClose,
          open: open,
          disabled: isInputDisabled,
          disableSubmit: hasUploadInProgress,
          hasAttachments: Boolean(stagedAttachments === null || stagedAttachments === void 0 ? void 0 : stagedAttachments.size),
          expanded: menuOpen && menuOpenExpandedRef.current || showPrompts,
          autoFocusInput: showPrompts,
          shouldAnimate: true,
          isButton: isButton,
          glowColor: glowColor,
          buttonLabel: buttonLabel,
          addMenu: addMenu,
          fileUploads: fileUploads,
          onExpandedChange: handleExpandedChange,
          outsideClickBoundaryRef: launcherAreaRef
        }), showPrompts && /*#__PURE__*/_jsx("div", {
          style: {
            order: -1
          },
          children: /*#__PURE__*/_jsx(SpotlightQuickPrompts, {
            onSubmit: onSubmitMessage,
            isInputFocused: showPrompts,
            menuOpen: menuOpen
          })
        })]
      })
    })
  });
};
SpotlightLauncher.displayName = 'SpotlightLauncher';
export default SpotlightLauncher;