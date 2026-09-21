import SVGBreezeSingleStar from 'visitor-ui-component-library-icons/icons/SVGBreezeSingleStar';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import styled from 'styled-components';
import I18n from 'I18n';
import { useButton } from 'react-aria';
import { useCustomerAgentHover } from '../contexts/CustomerAgentHoverContext';
import { calculateChatWidgetWidth } from '../widget-dimensions/calculateChatWidgetWidth';
import { COMPOSER_INLINE_MARGIN } from '../widget-dimensions/constants/dimensions';
import { MIN_LAUNCHER_WIDTH } from './constants/launcherDimensions';
import { useTransitionAnimationCallbacks } from 'visitor-ui-component-library/utils/hooks/useTransitionAnimationCallback';
import SVGSendOutline from 'visitor-ui-component-library-icons/icons/SVGSendOutline';
import { NEUTRAL_700 } from 'visitor-ui-component-library/constants/WidgetColors';
import { useChatWidgetLocale } from './ChatWidgetLocaleContext';
import { useDetachedWindow } from '../contexts/DetachedWindowContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const LauncherContainer = styled.div.withConfig({
  displayName: "PillLauncher__LauncherContainer"
})(["border:1px solid ", ";border-radius:27px;min-width:", "px;width:", ";padding:0 10px;display:flex;justify-content:space-between;align-items:center;box-shadow:rgba(20,20,20,0.08) 0px 8px 16px 0px;transition:", ";min-height:40px;overflow:hidden;cursor:pointer;position:relative;background-color:white;"], NEUTRAL_700, MIN_LAUNCHER_WIDTH, ({
  $width
}) => $width, ({
  $hoverReady
}) => $hoverReady ? 'width 0.7s ease' : 'none');
const PlaceholderWrapper = styled.div.withConfig({
  displayName: "PillLauncher__PlaceholderWrapper"
})(["display:flex;align-items:center;gap:8px;"]);
const Placeholder = styled.span.withConfig({
  displayName: "PillLauncher__Placeholder"
})(["margin:auto 0;white-space:nowrap;padding-right:8px;width:max-content;"]);
const PillLauncher = ({
  onOpen,
  coloring,
  placeholder,
  browserWindowWidth,
  widgetSize,
  onLauncherAnimationStart,
  onLauncherAnimationFinished
}) => {
  const {
    isDetached
  } = useDetachedWindow();
  const {
    isHoverActive: hovering,
    launcherRef,
    reducedLauncherWidth,
    hoverReady
  } = useCustomerAgentHover();
  const locale = useChatWidgetLocale();
  const getDefaultPlaceholder = () => {
    if (isDetached) {
      return I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.chatOpenInNewWindow');
    }
    return placeholder || I18n.text('conversations-visitor-experience-components.askMeAnythingLauncher.placeholder', {
      locale
    });
  };
  const defaultPlaceholder = getDefaultPlaceholder();
  useTransitionAnimationCallbacks({
    onTransitionStart: onLauncherAnimationStart,
    onTransitionEnd: onLauncherAnimationFinished
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  launcherRef);
  const {
    buttonProps
  } = useButton({
    onPress: onOpen,
    elementType: 'div',
    'aria-label': I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.open', {
      locale
    })
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  launcherRef);
  const expandedLauncherWidth = calculateChatWidgetWidth(browserWindowWidth, widgetSize.width) - COMPOSER_INLINE_MARGIN * 2;
  const width = hovering ? `${expandedLauncherWidth}px` : `${reducedLauncherWidth}px`;
  return /*#__PURE__*/_jsxs(LauncherContainer, Object.assign({}, buttonProps, {
    // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
    ref: launcherRef,
    "data-test-id": "pill-launcher",
    $hovering: hovering,
    $width: width,
    $accentColor: coloring.accentColor,
    $hoverReady: hoverReady,
    children: [/*#__PURE__*/_jsxs(PlaceholderWrapper, {
      children: [/*#__PURE__*/_jsx(VizExIcon, {
        size: "sm",
        icon: /*#__PURE__*/_jsx(SVGBreezeSingleStar, {}),
        "data-test-id": "star-icon"
      }), /*#__PURE__*/_jsx(Placeholder, {
        children: defaultPlaceholder
      })]
    }), /*#__PURE__*/_jsx(VizExIcon, {
      size: "sm",
      icon: /*#__PURE__*/_jsx(SVGSendOutline, {})
    })]
  }));
};
PillLauncher.displayName = 'PillLauncher';
export default PillLauncher;