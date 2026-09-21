import I18n from 'I18n';
import { Component } from 'react';
import KBArticleHeader from './KBArticleHeader';
import WidgetHeaderContent from '../widget-header/WidgetHeaderContent';
import WidgetHeaderBackButton from '../widget-header/WidgetHeaderBackButton';
import WidgetHeaderStyleWrapper from '../../presentation-components/WidgetHeaderStyleWrapper';
import { THREAD_VIEW, THREAD_LIST, KNOWLEDGE_BASE, KNOWLEDGE_BASE_ARTICLE, CATEGORY_VIEW } from '../constants/views';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import ChatMenu from '../../presentation-components/ChatMenu';
import styled, { ThemeProvider, withTheme } from 'styled-components';
import { setPrimaryColor, setTextOnPrimaryColor, setFontFamily } from 'visitor-ui-component-library/theme/defaultThemeOperators';
import { DEFAULT_TEXT_COLOR, WHITE } from 'visitor-ui-component-library/theme/ColorConstants';
import { createTheme } from 'visitor-ui-component-library/theme/createTheme';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import KBSearchInput from '../../knowledge-base/KBSearchInput';
import WidgetExpandToggleButton from '../../presentation-components/WidgetExpandToggleButton';
import { useDetachedWindow } from '../../contexts/DetachedWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const Spacer = styled.div.withConfig({
  displayName: "WidgetHeader__Spacer"
})(["flex-grow:1;"]);
const CloseButton = styled(VizExIconButton).withConfig({
  displayName: "WidgetHeader__CloseButton"
})(["font-size:16px;", ""], ({
  $focusRingColor
}) => getFocusRingStyles({
  ringColor: $focusRingColor
}));
const WidgetHeaderTopLevel = styled.div.withConfig({
  displayName: "WidgetHeader__WidgetHeaderTopLevel"
})(["display:flex;width:100%;"]);
export const WidgetHeaderChatMenu = ({
  focusRingColor,
  getItems
}) => {
  const {
    isDetachEnabled,
    isDetached,
    isDetachedWindow,
    toggleDetachedWindow
  } = useDetachedWindow();
  const items = getItems({
    isDetachEnabled,
    isDetached,
    isDetachedWindow,
    toggleDetachedWindow
  });
  if (items.length === 0) {
    return null;
  }
  return /*#__PURE__*/_jsx(ChatMenu, {
    items: items,
    focusRingColor: focusRingColor,
    menuTriggerAriaLabel: I18n.text('conversations-visitor-experience-components.chatMenu.menuTrigger'),
    menuAriaLabel: I18n.text('conversations-visitor-experience-components.chatMenu.menuLabel')
  });
};
WidgetHeaderChatMenu.displayName = 'WidgetHeaderChatMenu';
class WidgetHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAvailabilityMessage: false
    };
  }
  getAvailabilityMessage() {
    return this.props.preview ? this.props.previewResponseTimeText : this.props.typicalResponseTimeMessage || this.props.officeHoursMessage;
  }
  getThreadViewChatMenuItems({
    isDetachEnabled,
    isDetached,
    toggleDetachedWindow
  }) {
    const {
      isUngatedForCloseThread,
      onEndChat,
      isThreadPersisted,
      isThreadClosed,
      view
    } = this.props;
    const items = [];
    if (isUngatedForCloseThread && view === THREAD_VIEW) {
      items.push({
        id: 'end-chat',
        label: I18n.text('conversations-visitor-experience-components.chatMenu.endChat'),
        onClick: onEndChat !== null && onEndChat !== void 0 ? onEndChat : () => {},
        testId: 'end-chat-menu-item',
        disabled: !isThreadPersisted || isThreadClosed
      });
    }
    if (isDetachEnabled) {
      items.push({
        id: 'detach-widget',
        label: isDetached ? I18n.text('conversations-visitor-experience-components.chatMenu.reattach') : I18n.text('conversations-visitor-experience-components.chatMenu.detach'),
        onClick: toggleDetachedWindow,
        testId: 'detach-widget-menu-item'
      });
    }
    return items;
  }
  getShowAvailabilityMessage() {
    const {
      showAvailabilityMessage,
      typicalResponseTimeMessage,
      officeHoursMessage,
      preview,
      previewResponseTimeText
    } = this.props;
    const showRealAvailabilityMessage = showAvailabilityMessage && (typicalResponseTimeMessage || officeHoursMessage);
    if (showRealAvailabilityMessage) {
      return true;
    }
    return Boolean(preview && !!previewResponseTimeText);
  }
  render() {
    const {
      backButtonDisabled,
      browserWindowHeight,
      chatHeadingConfig,
      chatHeadingResponders,
      coloring,
      createNewThread,
      customHeaderText,
      inline,
      isThreadAssigned,
      kbArticleDeepLink,
      mobile = Boolean(this.props.mobile),
      navigateBack,
      onClose,
      restorePreviousViewFromKBArticle,
      showBackButton,
      toggleWidgetSizeForKBArticle,
      unseenThreadsCountExcludingCurrentThread,
      view,
      viewKBArticleExpanded,
      theme,
      enableAIDisclaimer
    } = this.props;
    const {
      accentColor,
      useDefaultColor
    } = coloring;
    const isKBArticle = view === KNOWLEDGE_BASE_ARTICLE && kbArticleDeepLink;
    const focusRingColor = useDefaultColor ? DEFAULT_TEXT_COLOR : WHITE;
    const operators = [setPrimaryColor(accentColor), setFontFamily(theme.fontFamily)];
    if (useDefaultColor) {
      operators.push(setTextOnPrimaryColor(DEFAULT_TEXT_COLOR));
    }
    return /*#__PURE__*/_jsx(ThemeProvider, {
      theme: createTheme(...operators),
      children: /*#__PURE__*/_jsxs(WidgetHeaderStyleWrapper, {
        mobile: mobile,
        coloring: coloring,
        inline: inline || false,
        children: [/*#__PURE__*/_jsxs(WidgetHeaderTopLevel, {
          children: [showBackButton && !isKBArticle && /*#__PURE__*/_jsx(WidgetHeaderBackButton, {
            navigateBack: navigateBack,
            unseenThreadsCountExcludingCurrentThread: unseenThreadsCountExcludingCurrentThread,
            disabled: backButtonDisabled,
            focusRingColor: focusRingColor
          }), isKBArticle && /*#__PURE__*/_jsx(KBArticleHeader, {
            browserWindowHeight: browserWindowHeight || 0,
            inline: inline || false,
            kbArticleDeepLink: kbArticleDeepLink,
            restorePreviousViewFromKBArticle: restorePreviousViewFromKBArticle || (() => {}),
            mobile: mobile,
            toggleWidgetSizeForKBArticle: toggleWidgetSizeForKBArticle || (() => {}),
            viewKBArticleExpanded: viewKBArticleExpanded || false,
            preview: this.props.preview
          }), /*#__PURE__*/_jsx(WidgetHeaderContent, {
            availabilityMessage: this.getAvailabilityMessage(),
            chatHeadingConfig: chatHeadingConfig,
            createNewThread: createNewThread || (() => {}),
            coloring: coloring,
            customHeaderText: customHeaderText,
            showStatusIndicator: isThreadAssigned || false,
            mobile: mobile,
            chatHeadingResponders: chatHeadingResponders,
            showAvailabilityMessage: this.getShowAvailabilityMessage(),
            enableAIDisclaimer: enableAIDisclaimer,
            showCreateThreadButton: view === THREAD_LIST || view === KNOWLEDGE_BASE,
            showKBArticleHeader: view === KNOWLEDGE_BASE_ARTICLE,
            showThreadListHeader: view === THREAD_LIST || view === KNOWLEDGE_BASE || view === CATEGORY_VIEW
          }), /*#__PURE__*/_jsx(Spacer, {}), /*#__PURE__*/_jsx(WidgetHeaderChatMenu, {
            focusRingColor: focusRingColor,
            getItems: detachContext => this.getThreadViewChatMenuItems(detachContext)
          }), /*#__PURE__*/_jsx(WidgetExpandToggleButton, {
            className: "m-left-2"
          }), !!onClose && /*#__PURE__*/_jsx(CloseButton, {
            "data-test-id": "header-close-button",
            onClick: onClose,
            "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.close'),
            className: "m-left-2",
            use: "transparent-on-primary",
            $focusRingColor: focusRingColor,
            children: /*#__PURE__*/_jsx(VizExIcon, {
              icon: /*#__PURE__*/_jsx(SVGClose, {
                height: 20,
                width: 20
              })
            })
          })]
        }), view === KNOWLEDGE_BASE && /*#__PURE__*/_jsx(KBSearchInput, {})]
      })
    });
  }
}

// I hate that I have to do this...but we have nested theme providers
// and I need to pass the theme down to the new theme
// like who does that??
WidgetHeader.displayName = 'WidgetHeader';
WidgetHeader.defaultProps = {
  createNewThread: () => {},
  inline: false,
  isThreadAssigned: false,
  isThreadClosed: false,
  isThreadPersisted: false,
  isThreadStarted: false,
  isUngatedForCloseThread: false,
  navigateBack: () => {},
  showBackButton: false,
  showAvailabilityMessage: false,
  unseenThreadsCountExcludingCurrentThread: 0,
  view: THREAD_VIEW,
  viewKBArticleExpanded: false,
  theme: {}
};
export default withTheme(WidgetHeader);