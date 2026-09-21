import { RIGHT_ALIGNED } from '../constants/WidgetLocations';
import WidgetHeader from './WidgetHeader';
import SpotlightWidgetContent from './SpotlightWidgetContent';
import VisitorWidgetStyleWrapper from '../../presentation-components/VisitorWidgetStyleWrapper';
import styled from 'styled-components';
import { THREAD_VIEW } from '../constants/views';
import KBNavigation from './KBNavigation';
import { WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import { KBSearchProvider } from '../../knowledge-base/context/KBSearchProvider';
import { getAvailabilitySubtitleText } from '../operators/getAvailabilitySubtitleText';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export const WidgetBodyDiv = styled.div.withConfig({
  displayName: "VisitorWidget__WidgetBodyDiv"
})(["display:flex;flex-direction:column;height:100%;background-color:", ";overflow:auto;"], WHITE);
export const WidgetBodyDivWrapper = styled.div.withConfig({
  displayName: "VisitorWidget__WidgetBodyDivWrapper"
})(["flex:1;min-height:0;display:flex;flex-direction:column;"]);
const VisitorWidget = ({
  backButtonDisabled,
  browserWindowHeight,
  browserWindowWidth,
  chatHeadingConfig,
  chatHeadingResponders,
  children,
  closeWidget,
  coloring,
  createNewThread,
  customHeaderText = null,
  endChat,
  inline = false,
  isThreadAssigned = false,
  isThreadClosed = false,
  isThreadPersisted = false,
  isThreadStarted = false,
  kbArticleDeepLink,
  restorePreviousViewFromKBArticle,
  mobile = false,
  navigateToKnowledgeBaseArticle,
  navigateBack,
  officeHoursMessage,
  setWidgetSize,
  showAvailabilityMessage,
  showBackButton,
  size = 'default',
  style,
  toggleWidgetSizeForKBArticle,
  typicalResponseTimeMessage,
  unseenThreadsCountExcludingCurrentThread,
  view = THREAD_VIEW,
  viewKBArticleExpanded,
  widgetLocation = RIGHT_ALIGNED,
  widgetSize,
  updateView,
  kbNavigationEnabled,
  isUngatedForCloseThread = false,
  isSpotlight = false,
  isWidgetOpen,
  enableAIDisclaimer = false,
  chatThreadHistoryMenu,
  onLightboxIsOpen
}) => {
  return /*#__PURE__*/_jsx(VisitorWidgetStyleWrapper, {
    browserWindowHeight: browserWindowHeight,
    browserWindowWidth: browserWindowWidth,
    inline: inline,
    isSpotlight: isSpotlight,
    size: size,
    style: style,
    mobile: mobile,
    widgetLocation: widgetLocation,
    widgetSize: widgetSize,
    children: /*#__PURE__*/_jsxs(KBSearchProvider, {
      children: [isSpotlight ? /*#__PURE__*/_jsx(SpotlightWidgetContent, {
        availabilityMessage: getAvailabilitySubtitleText(showAvailabilityMessage, typicalResponseTimeMessage, officeHoursMessage),
        chatHeadingConfig: chatHeadingConfig,
        chatHeadingResponders: chatHeadingResponders,
        coloring: coloring,
        isThreadAssigned: isThreadAssigned,
        isThreadClosed: isThreadClosed,
        isThreadPersisted: isThreadPersisted,
        isUngatedForCloseThread: isUngatedForCloseThread,
        kbArticleDeepLink: kbArticleDeepLink,
        onClose: closeWidget,
        onEndChat: endChat,
        chatThreadHistoryMenu: chatThreadHistoryMenu,
        isWidgetOpen: isWidgetOpen,
        onLightboxIsOpen: onLightboxIsOpen,
        view: view,
        children: children
      }) : /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(WidgetHeader, {
          backButtonDisabled: backButtonDisabled,
          browserWindowHeight: browserWindowHeight,
          chatHeadingConfig: chatHeadingConfig,
          coloring: coloring,
          chatHeadingResponders: chatHeadingResponders,
          createNewThread: createNewThread,
          customHeaderText: customHeaderText,
          inline: inline,
          isThreadAssigned: isThreadAssigned,
          isThreadClosed: isThreadClosed,
          isThreadPersisted: isThreadPersisted,
          isThreadStarted: isThreadStarted,
          kbArticleDeepLink: kbArticleDeepLink,
          restorePreviousViewFromKBArticle: restorePreviousViewFromKBArticle,
          mobile: mobile,
          navigateToKnowledgeBaseArticle: navigateToKnowledgeBaseArticle,
          navigateBack: navigateBack,
          officeHoursMessage: officeHoursMessage,
          onClose: closeWidget,
          onEndChat: endChat,
          toggleWidgetSizeForKBArticle: toggleWidgetSizeForKBArticle,
          setWidgetSize: setWidgetSize,
          showAvailabilityMessage: showAvailabilityMessage,
          showBackButton: showBackButton,
          typicalResponseTimeMessage: typicalResponseTimeMessage,
          unseenThreadsCountExcludingCurrentThread: unseenThreadsCountExcludingCurrentThread,
          view: view,
          viewKBArticleExpanded: viewKBArticleExpanded,
          isUngatedForCloseThread: isUngatedForCloseThread,
          enableAIDisclaimer: enableAIDisclaimer
        }), /*#__PURE__*/_jsx(WidgetBodyDivWrapper, {
          kbNavigationEnabled: kbNavigationEnabled,
          children: /*#__PURE__*/_jsx(WidgetBodyDiv, {
            children: children
          })
        })]
      }), kbNavigationEnabled && /*#__PURE__*/_jsx(KBNavigation, {
        coloring: coloring,
        updateView: updateView,
        view: view
      })]
    })
  });
};
VisitorWidget.displayName = 'VisitorWidget';
export default VisitorWidget;