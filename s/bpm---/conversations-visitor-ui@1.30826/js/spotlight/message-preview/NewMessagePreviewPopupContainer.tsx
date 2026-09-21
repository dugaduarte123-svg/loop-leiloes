import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { calculateSpotlightLauncherWidth } from 'conversations-visitor-experience-components/widget-dimensions/calculateSpotlightLauncherWidth';
import NewMessagePreviewPopup from './NewMessagePreviewPopup';
import { useAppDispatch } from '../../buildStore';
import { getNewMessagePreviewPopupData } from './selectors/getNewMessagePreviewPopupData';
import { getShowNewMessagePreviewPopup } from './selectors/getShowNewMessagePreviewPopup';
import { getNewMessagePreviewPopupCount } from './selectors/getNewMessagePreviewPopupCount';
import { dismissNewMessagePreviewPopup } from './reducers/newMessagePreviewPopupSlice';
import { jsx as _jsx } from "react/jsx-runtime";
const NewMessagePreviewPopupContainer = ({
  onOpen,
  browserWindowWidth
}) => {
  const dispatch = useAppDispatch();
  const showPreview = useSelector(getShowNewMessagePreviewPopup);
  const previewData = useSelector(getNewMessagePreviewPopupData);
  const unreadCount = useSelector(getNewMessagePreviewPopupCount);
  const [isDismissing, setIsDismissing] = useState(false);
  const dismissingDataRef = useRef(previewData);
  const handleDismiss = useCallback(() => {
    dismissingDataRef.current = previewData;
    setIsDismissing(true);
  }, [previewData]);
  const handleDismissAnimationEnd = useCallback(() => {
    setIsDismissing(false);
    // Only dismiss if no new message arrived during the exit animation
    if (dismissingDataRef.current === previewData) {
      dispatch(dismissNewMessagePreviewPopup());
    }
  }, [dispatch, previewData]);
  const handleOpen = useCallback(() => {
    dispatch(dismissNewMessagePreviewPopup());
    onOpen();
  }, [dispatch, onOpen]);
  if (!showPreview || !previewData) return null;
  return /*#__PURE__*/_jsx(NewMessagePreviewPopup, Object.assign({}, previewData, {
    isDismissing: isDismissing,
    unreadCount: unreadCount,
    width: calculateSpotlightLauncherWidth(browserWindowWidth, false),
    onDismiss: handleDismiss,
    onDismissAnimationEnd: handleDismissAnimationEnd,
    onOpen: handleOpen
  }));
};
NewMessagePreviewPopupContainer.displayName = 'NewMessagePreviewPopupContainer';
export default NewMessagePreviewPopupContainer;