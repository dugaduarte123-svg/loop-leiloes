import { useSelector, useDispatch } from 'react-redux';
import WelcomeMessage from 'conversations-visitor-experience-components/visitor-widget/components/WelcomeMessage';
import { useWelcomeMessageAvatarsData } from '../hooks/useWelcomeMessageAvatarsData';
import { useWelcomeMessageConfig } from '../hooks/useWelcomeMessageConfig';
import { WelcomePageWrapper, WelcomePageContent } from 'conversations-visitor-experience-components/initial-page/WelcomePageLayoutComponents';
import { getWidgetLocation } from '../selectors/widgetDataSelectors/getWidgetLocation';
import { getUsePillLauncher, getUseSpotlightLauncher } from '../widget-data/selectors/widgetDataSelectors';
import { toggleOpen } from '../actions/WidgetActions';
import { closeInitialMessageBubble } from '../initial-message-bubble/actions/closeInitialMessageBubble';
import { getShouldHideWelcomeMessage } from '../selectors/getShouldHideWelcomeMessage';
import { jsx as _jsx } from "react/jsx-runtime";
const WidgetWelcomePage = ({
  onClose,
  initialMessage,
  isMobile = false
}) => {
  const dispatch = useDispatch();
  const widgetLocation = useSelector(getWidgetLocation);
  const usePillLauncher = useSelector(getUsePillLauncher);
  const useSpotlightLauncher = useSelector(getUseSpotlightLauncher);
  const shouldHideWelcomeMessage = useSelector(getShouldHideWelcomeMessage);
  const {
    chatHeadingConfig,
    chatHeadingResponders
  } = useWelcomeMessageAvatarsData();
  const {
    showQuickReplies,
    quickRepliesConfig,
    consentConfig
  } = useWelcomeMessageConfig();
  const showWelcomeMessage = initialMessage && !shouldHideWelcomeMessage;
  const handleWelcomeMessageClick = () => {
    dispatch(toggleOpen({
      isOpened: true,
      isUser: true,
      openedFrom: 'welcome message click'
    }));
  };
  const handleCloseButtonClick = () => {
    dispatch(closeInitialMessageBubble());
    onClose();
  };
  if (usePillLauncher || useSpotlightLauncher) {
    return null;
  }
  return /*#__PURE__*/_jsx(WelcomePageWrapper, {
    widgetLocation: widgetLocation,
    "data-test-id": "welcome-page-wrapper",
    children: /*#__PURE__*/_jsx(WelcomePageContent, {
      children: showWelcomeMessage && /*#__PURE__*/_jsx(WelcomeMessage, {
        onClick: handleWelcomeMessageClick,
        initialMessage: initialMessage,
        isMobile: isMobile,
        chatHeadingConfig: chatHeadingConfig,
        chatHeadingResponders: chatHeadingResponders,
        onClose: handleCloseButtonClick,
        showQuickReplies: showQuickReplies,
        quickRepliesConfig: quickRepliesConfig,
        consentConfig: consentConfig
      })
    })
  });
};
WidgetWelcomePage.displayName = 'WidgetWelcomePage';
export default WidgetWelcomePage;