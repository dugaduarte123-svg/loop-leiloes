import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useRef } from 'react';
import styled, { css } from 'styled-components';
import SVGMessages from 'visitor-ui-component-library-icons/icons/SVGMessages';
import SVGQuestion from 'visitor-ui-component-library-icons/icons/SVGQuestion';
import { NEUTRAL_200, NEUTRAL_400, WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { DEFAULT_TEXT_COLOR } from 'visitor-ui-component-library/theme/ColorConstants';
import { adjustLuminance } from 'visitor-ui-component-library/utils/adjustLuminance';
import { KNOWLEDGE_BASE, THREAD_LIST } from '../constants/views';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const NavigationWrapper = styled.div.withConfig({
  displayName: "KBNavigation__NavigationWrapper"
})(["height:76px;width:100%;display:flex;justify-content:center;align-items:center;"]);
const NavigationButtonWrapper = styled.div.withConfig({
  displayName: "KBNavigation__NavigationButtonWrapper"
})(["display:flex;flex-direction:row;align-items:center;justify-content:center;background-color:", ";border-radius:20px;border:1px solid ", ";gap:10px;width:292px;height:44px;overflow:hidden;"], NEUTRAL_200, NEUTRAL_400);
const NavigationButton = styled.button.withConfig({
  displayName: "KBNavigation__NavigationButton"
})(({
  theme,
  $active,
  $useDefaultColor
}) => {
  const primaryColor = $useDefaultColor ? DEFAULT_TEXT_COLOR : theme.colors.primary;
  return css(["display:flex;gap:6px;border:none;background-color:", ";padding:0;flex:1;height:42px;align-items:center;justify-content:center;outline:none;color:", ";transition:background-color 0.3s ease;font-size:14px;border-radius:20px;font-weight:600;&:hover:enabled{background-color:", ";color:", ";}&:focus-visible{background-color:", ";color:", ";}"], $active ? primaryColor : NEUTRAL_200, $active ? WHITE : primaryColor, $active ? adjustLuminance(primaryColor, 10) : primaryColor, NEUTRAL_200, NEUTRAL_200, primaryColor);
});
const KBNavigation = ({
  coloring,
  updateView,
  view
}) => {
  const selectChatButton = useRef(null);
  const selectKBButton = useRef(null);
  const useDefaultColor = coloring.useDefaultColor;
  const handleKeyDown = event => {
    if (event.key === 'ArrowRight') {
      updateView(KNOWLEDGE_BASE);
      if (selectKBButton !== null && selectKBButton !== void 0 && selectKBButton.current) {
        selectKBButton.current.focus();
      }
    }
    if (event.key === 'ArrowLeft') {
      updateView(THREAD_LIST);
      if (selectChatButton !== null && selectChatButton !== void 0 && selectChatButton.current) {
        selectChatButton.current.focus();
      }
    }
  };
  return /*#__PURE__*/_jsx(NavigationWrapper, {
    role: "tablist",
    "aria-label": I18n.text('conversations-visitor-experience-components.visitorWidget.navigation.kbNavigation'),
    children: /*#__PURE__*/_jsxs(NavigationButtonWrapper, {
      children: [/*#__PURE__*/_jsxs(NavigationButton, {
        $active: !view || view === THREAD_LIST,
        $useDefaultColor: useDefaultColor,
        "aria-selected": view === THREAD_LIST,
        onClick: () => updateView(THREAD_LIST),
        onKeyDown: handleKeyDown,
        role: "tab",
        ref: selectChatButton,
        children: [/*#__PURE__*/_jsx(VizExIcon, {
          "aria-hidden": "true",
          icon: /*#__PURE__*/_jsx(SVGMessages, {
            height: 24,
            width: 24
          })
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "conversations-visitor-experience-components.visitorWidget.navigation.options.chat"
        })]
      }), /*#__PURE__*/_jsxs(NavigationButton, {
        $active: view === KNOWLEDGE_BASE,
        $useDefaultColor: useDefaultColor,
        "aria-selected": view === KNOWLEDGE_BASE,
        onClick: () => updateView(KNOWLEDGE_BASE),
        onKeyDown: handleKeyDown,
        role: "tab",
        ref: selectKBButton,
        children: [/*#__PURE__*/_jsx(VizExIcon, {
          "aria-hidden": "true",
          icon: /*#__PURE__*/_jsx(SVGQuestion, {
            height: 24,
            width: 24
          })
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "conversations-visitor-experience-components.visitorWidget.navigation.options.help"
        })]
      })]
    })
  });
};
KBNavigation.displayName = 'KBNavigation';
export default KBNavigation;