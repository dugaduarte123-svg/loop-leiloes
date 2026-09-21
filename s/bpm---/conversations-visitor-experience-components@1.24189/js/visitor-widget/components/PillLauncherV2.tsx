import { useRef } from 'react';
import styled from 'styled-components';
import { useButton } from 'react-aria';
import I18n from 'I18n';
import SVGBreezeSingleStar from 'visitor-ui-component-library-icons/icons/SVGBreezeSingleStar';
import SVGSendOutline from 'visitor-ui-component-library-icons/icons/SVGSendOutline';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import { WHITE, NEUTRAL_700 } from 'visitor-ui-component-library/constants/WidgetColors';
import { useChatWidgetLocale } from '../ChatWidgetLocaleContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const LauncherContainer = styled.div.withConfig({
  displayName: "PillLauncherV2__LauncherContainer"
})(["border:1px solid ", ";border-radius:27px;padding:0 10px;display:flex;justify-content:space-between;align-items:center;min-height:40px;cursor:pointer;background-color:", ";width:100%;box-sizing:border-box;"], NEUTRAL_700, WHITE);
const PlaceholderWrapper = styled.div.withConfig({
  displayName: "PillLauncherV2__PlaceholderWrapper"
})(["display:flex;align-items:center;gap:8px;"]);
const Placeholder = styled.span.withConfig({
  displayName: "PillLauncherV2__Placeholder"
})(["margin:auto 0;white-space:nowrap;padding-right:8px;width:max-content;"]);
const PillLauncherV2 = ({
  onOpen,
  placeholder,
  'data-test-id': dataTestId = 'pill-launcher-v2'
}) => {
  const launcherRef = useRef(null);
  const locale = useChatWidgetLocale();
  const defaultPlaceholder = placeholder || I18n.text('conversations-visitor-experience-components.askMeAnythingLauncher.placeholder', {
    locale
  });
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
  return /*#__PURE__*/_jsxs(LauncherContainer, Object.assign({}, buttonProps, {
    ref: launcherRef,
    "data-test-id": dataTestId,
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
PillLauncherV2.displayName = 'PillLauncherV2';
export default PillLauncherV2;