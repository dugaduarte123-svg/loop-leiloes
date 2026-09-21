import styled from 'styled-components';
import SpotlightThemeProvider from '../spotlight/SpotlightThemeProvider';
import SpotlightWidgetHeader from './SpotlightWidgetHeader';
import { THREAD_VIEW } from '../constants/views';
import { ImageLightboxProvider } from '../../lightbox/ImageLightboxContext';
import ImageLightboxContainer from '../spotlight/lightbox/ImageLightboxContainer';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const ContentWrapper = styled.div.withConfig({
  displayName: "SpotlightWidgetContent__ContentWrapper"
})(["flex:1;min-height:0;display:flex;flex-direction:column;"]);
const Content = styled.div.withConfig({
  displayName: "SpotlightWidgetContent__Content"
})(["display:flex;flex-direction:column;height:100%;background-color:", ";overflow:auto;"], ({
  theme
}) => theme.spotlight.color.surface);
export default function SpotlightWidgetContent({
  availabilityMessage,
  chatHeadingConfig,
  chatHeadingResponders,
  children,
  coloring,
  isThreadAssigned = false,
  isThreadClosed = false,
  isThreadPersisted = false,
  isUngatedForCloseThread = false,
  isWidgetOpen,
  kbArticleDeepLink,
  onClose,
  onEndChat,
  chatThreadHistoryMenu,
  onLightboxIsOpen,
  view = THREAD_VIEW
}) {
  return /*#__PURE__*/_jsx(SpotlightThemeProvider, {
    children: /*#__PURE__*/_jsxs(ImageLightboxProvider, {
      isWidgetOpen: isWidgetOpen,
      onLightboxIsOpen: onLightboxIsOpen,
      children: [/*#__PURE__*/_jsx(ImageLightboxContainer, {}), /*#__PURE__*/_jsx(SpotlightWidgetHeader, {
        availabilityMessage: availabilityMessage,
        chatHeadingConfig: chatHeadingConfig,
        chatHeadingResponders: chatHeadingResponders,
        coloring: coloring,
        isThreadAssigned: isThreadAssigned,
        isThreadClosed: isThreadClosed,
        isThreadPersisted: isThreadPersisted,
        isUngatedForCloseThread: isUngatedForCloseThread,
        kbArticleDeepLink: kbArticleDeepLink,
        onClose: onClose,
        onEndChat: onEndChat,
        chatThreadHistoryMenu: chatThreadHistoryMenu,
        view: view
      }), /*#__PURE__*/_jsx(ContentWrapper, {
        children: /*#__PURE__*/_jsx(Content, {
          children: children
        })
      })]
    })
  });
}
SpotlightWidgetContent.displayName = 'SpotlightWidgetContent';