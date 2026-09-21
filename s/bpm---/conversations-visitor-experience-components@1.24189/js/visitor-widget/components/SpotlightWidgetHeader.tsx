import { Fragment } from 'react';
import I18n from 'I18n';
import styled, { css, ThemeProvider } from 'styled-components';
import { setPrimaryColor, setTextOnPrimaryColor } from 'visitor-ui-component-library/theme/defaultThemeOperators';
import { createTheme } from 'visitor-ui-component-library/theme/createTheme';
import SVGDown from 'visitor-ui-component-library-icons/icons/SVGDown';
import SVGEllipses from 'visitor-ui-component-library-icons/icons/SVGEllipses';
import SVGExternalLink from 'visitor-ui-component-library-icons/icons/SVGExternalLink';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExLink from 'visitor-ui-component-library/link/VizExLink';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { hexToRgba } from 'visitor-ui-component-library/utils/hexToRgba';
import { NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { getIsResponderAI, getJobTitle } from 'conversations-internal-schema/responders/operators/responderGetters';
import ChatHeadingAvatars from '../widget-header/ChatHeadingAvatars';
import { getWidgetTitleText } from '../operators/getWidgetTitleText';
import { useChatWidgetLocale } from '../ChatWidgetLocaleContext';
import ChatMenu from '../../presentation-components/ChatMenu';
import { THREAD_VIEW, KNOWLEDGE_BASE_ARTICLE } from '../constants/views';
import { HEADER_TEXT_TITLE_ID } from '../constants/textIds';
import { useSpotlightTheme } from '../spotlight/SpotlightThemeContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const getSpotlightIndicatorStyle = surface => css(["bottom:0;border:none;box-shadow:0 0 0 2px ", ";width:10px;height:10px;"], surface);
const SpotlightHeaderWrapper = styled.header.withConfig({
  displayName: "SpotlightWidgetHeader__SpotlightHeaderWrapper"
})(["background-color:", ";border-radius:16px 16px 0 0;padding:12px 16px;box-sizing:border-box;box-shadow:0px 1px 5px 0px rgba(0,0,0,0.05);position:relative;z-index:1;"], ({
  theme
}) => theme.spotlight.color.surface);
const SpotlightHeaderContent = styled.div.withConfig({
  displayName: "SpotlightWidgetHeader__SpotlightHeaderContent"
})(["display:flex;align-items:center;justify-content:space-between;width:100%;height:34px;"]);
const HeaderActions = styled.div.withConfig({
  displayName: "SpotlightWidgetHeader__HeaderActions"
})(["display:flex;align-items:center;gap:8px;"]);
const AgentInfoWrapper = styled.span.withConfig({
  displayName: "SpotlightWidgetHeader__AgentInfoWrapper"
})(["display:flex;align-items:center;gap:8px;"]);
const HeaderTextColumn = styled.span.withConfig({
  displayName: "SpotlightWidgetHeader__HeaderTextColumn"
})(["display:flex;flex-direction:column;justify-content:center;"]);
const HeaderTitleRow = styled.span.withConfig({
  displayName: "SpotlightWidgetHeader__HeaderTitleRow"
})(["display:flex;align-items:center;gap:8px;"]);
const HeaderNameText = styled.span.withConfig({
  displayName: "SpotlightWidgetHeader__HeaderNameText"
})(["font-size:14px;font-weight:400;line-height:18px;color:", ";margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"], ({
  theme
}) => theme.spotlight.color.ink);
const StyledExternalLink = styled(VizExLink).withConfig({
  displayName: "SpotlightWidgetHeader__StyledExternalLink"
})(["display:flex;align-items:center;justify-content:center;width:32px;height:32px;color:", ";border-radius:50%;&:hover{color:", ";background-color:", ";}", ""], NEUTRAL_1600, NEUTRAL_1600, hexToRgba(NEUTRAL_1600, 0.1), getFocusRingStyles({
  ringColor: NEUTRAL_1600
}));
const HeaderSubtitleText = styled.span.withConfig({
  displayName: "SpotlightWidgetHeader__HeaderSubtitleText"
})(["font-size:12px;font-weight:300;line-height:14px;letter-spacing:0;color:", ";margin:0;white-space:nowrap;"], ({
  theme
}) => theme.spotlight.color.mutedChrome);
const SpotlightWidgetHeader = ({
  availabilityMessage,
  chatHeadingConfig,
  chatHeadingResponders,
  coloring,
  isThreadAssigned = false,
  isThreadClosed = false,
  isThreadPersisted = false,
  isUngatedForCloseThread = false,
  kbArticleDeepLink,
  onClose = () => {},
  onEndChat,
  chatThreadHistoryMenu,
  view = THREAD_VIEW
}) => {
  var _getJobTitle;
  const isInArticleView = view === KNOWLEDGE_BASE_ARTICLE && Boolean(kbArticleDeepLink);
  const locale = useChatWidgetLocale();
  const {
    color
  } = useSpotlightTheme();
  const titleText = getWidgetTitleText(chatHeadingConfig, chatHeadingResponders, locale) || I18n.text('conversations-visitor-experience-components.default.agent');
  const isResponderAI = chatHeadingResponders.some(responder => getIsResponderAI(responder) === true);
  const jobTitle = chatHeadingResponders.size === 1 ? (_getJobTitle = getJobTitle(chatHeadingResponders.first())) !== null && _getJobTitle !== void 0 ? _getJobTitle : undefined : undefined;
  const subtitle = isResponderAI ? I18n.text('conversations-visitor-experience-components.isResponderAI') : jobTitle !== null && jobTitle !== void 0 ? jobTitle : availabilityMessage;
  const menuItems = [];
  if (isUngatedForCloseThread && view === THREAD_VIEW) {
    menuItems.push({
      id: 'end-chat',
      label: I18n.text('conversations-visitor-experience-components.chatMenu.endChat'),
      onClick: onEndChat !== null && onEndChat !== void 0 ? onEndChat : () => {},
      testId: 'end-chat-menu-item',
      disabled: !isThreadPersisted || isThreadClosed
    });
  }
  const AgentInfoContainer = chatThreadHistoryMenu !== null && chatThreadHistoryMenu !== void 0 ? chatThreadHistoryMenu : Fragment;
  return /*#__PURE__*/_jsx(ThemeProvider, {
    theme: outer => Object.assign({}, outer, createTheme(setPrimaryColor(coloring.accentColor), setTextOnPrimaryColor(color.ink))),
    children: /*#__PURE__*/_jsx(SpotlightHeaderWrapper, {
      role: "banner",
      "aria-labelledby": HEADER_TEXT_TITLE_ID,
      "data-test-id": "spotlight-widget-header",
      children: /*#__PURE__*/_jsxs(SpotlightHeaderContent, {
        children: [/*#__PURE__*/_jsx(AgentInfoContainer, {
          children: /*#__PURE__*/_jsxs(AgentInfoWrapper, {
            children: [/*#__PURE__*/_jsx(ChatHeadingAvatars, {
              chatHeadingConfig: chatHeadingConfig,
              chatHeadingResponders: chatHeadingResponders,
              isSpotlight: true,
              indicatorStyleOverride: getSpotlightIndicatorStyle(color.surface),
              showStatusIndicator: isThreadAssigned && !isResponderAI,
              borderColor: color.surface,
              size: "sm"
            }), /*#__PURE__*/_jsxs(HeaderTextColumn, {
              children: [/*#__PURE__*/_jsxs(HeaderTitleRow, {
                children: [/*#__PURE__*/_jsx(HeaderNameText, {
                  id: HEADER_TEXT_TITLE_ID,
                  "data-test-id": "spotlight-header-name",
                  children: titleText
                }), chatThreadHistoryMenu && /*#__PURE__*/_jsx(SVGDown, {
                  width: 12,
                  height: 12,
                  "aria-hidden": "true"
                })]
              }), subtitle && /*#__PURE__*/_jsx(HeaderSubtitleText, {
                "data-test-id": "spotlight-header-subtitle",
                children: subtitle
              })]
            })]
          })
        }), /*#__PURE__*/_jsxs(HeaderActions, {
          children: [isInArticleView && /*#__PURE__*/_jsx(StyledExternalLink, {
            href: kbArticleDeepLink,
            target: "_blank",
            rel: "noopener noreferrer",
            "aria-label": I18n.text('conversations-visitor-experience-components.knowledgeBase.kbArticle.openInNewTab'),
            "data-test-id": "spotlight-kb-open-in-new-tab",
            children: /*#__PURE__*/_jsx(SVGExternalLink, {
              width: 16,
              height: 16,
              "aria-hidden": "true"
            })
          }), menuItems.length > 0 && /*#__PURE__*/_jsx(ChatMenu, {
            items: menuItems,
            focusRingColor: color.ink,
            menuTriggerAriaLabel: I18n.text('conversations-visitor-experience-components.chatMenu.menuTrigger'),
            menuAriaLabel: I18n.text('conversations-visitor-experience-components.chatMenu.menuLabel'),
            menuTriggerIcon: SVGEllipses,
            triggerSize: "ms",
            triggerShape: "circle"
          }), /*#__PURE__*/_jsx(VizExIconButton, {
            onClick: onClose,
            "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.close'),
            "data-test-id": "spotlight-minimize-button",
            use: "transparent-on-primary",
            size: "ms",
            shape: "circle",
            children: /*#__PURE__*/_jsx(SVGDown, {
              width: 16,
              height: 16,
              "aria-hidden": "true"
            })
          })]
        })]
      })
    })
  });
};
SpotlightWidgetHeader.displayName = 'SpotlightWidgetHeader';
export default SpotlightWidgetHeader;