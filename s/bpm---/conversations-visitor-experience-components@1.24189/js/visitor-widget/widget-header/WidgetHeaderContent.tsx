import { Component, Fragment } from 'react';
import { ChatWidgetLocaleContextConsumer } from '../ChatWidgetLocaleContext';
import ThreadListHeader from './ThreadListHeader';
import WidgetHeaderAvatarWrapper from './WidgetHeaderAvatarWrapper';
import { DEFAULT_TEXT_COLOR } from 'visitor-ui-component-library/theme/ColorConstants';
import { jsx as _jsx } from "react/jsx-runtime";
class WidgetHeaderContent extends Component {
  render() {
    const {
      textColor,
      useDefaultColor
    } = this.props.coloring;
    const focusRingColor = useDefaultColor ? DEFAULT_TEXT_COLOR : textColor;
    const {
      availabilityMessage,
      chatHeadingConfig,
      chatHeadingResponders,
      createNewThread,
      customHeaderText,
      mobile,
      showAvailabilityMessage,
      showCreateThreadButton,
      showKBArticleHeader,
      showStatusIndicator,
      showThreadListHeader,
      enableAIDisclaimer
    } = this.props;
    if (showKBArticleHeader) return null;
    return /*#__PURE__*/_jsx(Fragment, {
      children: showThreadListHeader ? /*#__PURE__*/_jsx(ThreadListHeader, {
        createNewThread: createNewThread,
        customHeaderText: customHeaderText,
        textColor: textColor,
        focusRingColor: focusRingColor,
        showCreateThreadButton: showCreateThreadButton
      }) : /*#__PURE__*/_jsx(ChatWidgetLocaleContextConsumer, {
        children: locale => /*#__PURE__*/_jsx(WidgetHeaderAvatarWrapper, {
          availabilityMessage: availabilityMessage,
          borderColor: textColor,
          chatHeadingConfig: chatHeadingConfig,
          chatHeadingResponders: chatHeadingResponders,
          locale: locale,
          mobile: mobile,
          showAvailabilityMessage: showAvailabilityMessage,
          showStatusIndicator: showStatusIndicator,
          enableAIDisclaimer: enableAIDisclaimer
        })
      })
    });
  }
}
WidgetHeaderContent.displayName = 'WidgetHeaderContent';
export default WidgetHeaderContent;