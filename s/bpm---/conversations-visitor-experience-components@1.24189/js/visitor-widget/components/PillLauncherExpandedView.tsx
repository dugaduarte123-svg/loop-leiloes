import { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { WHITE, NEUTRAL_800 } from 'visitor-ui-component-library/constants/WidgetColors';
import { AIPromptRecommendations } from '../../customer-agent/AIPromptRecommendations';
import PillLauncherV2 from './PillLauncherV2';
import ConsentPromptV2 from './ConsentPromptV2';
import { WELCOME_MESSAGE } from '../constants/consentPromptVariants';
import { useChatWidgetLocale } from '../ChatWidgetLocaleContext';
import { LEFT_ALIGNED } from 'conversations-internal-schema/widget-location/constants/WidgetLocations';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export const ANIMATION_DURATION = 400;
const CONTAINER_WIDTH = 400;
const Container = styled.div.withConfig({
  displayName: "PillLauncherExpandedView__Container"
})(["width:", "px;background:", ";border-radius:16px;box-shadow:0px 24px 48px 0px rgba(0,0,0,0.08);padding:24px;padding-bottom:", ";display:flex;flex-direction:column;gap:16px;transition:opacity ", "ms cubic-bezier(0.4,0,0.2,1),transform ", "ms cubic-bezier(0.4,0,0.2,1);opacity:", ";transform:", ";"], CONTAINER_WIDTH, WHITE, ({
  spamProtectionEnabled
}) => spamProtectionEnabled ? '8px' : '24px', ANIMATION_DURATION, ANIMATION_DURATION, ({
  isVisible
}) => isVisible ? 1 : 0, ({
  isVisible
}) => isVisible ? 'translateY(0px)' : 'translateY(20px)');
const ContentWrapper = styled.div.withConfig({
  displayName: "PillLauncherExpandedView__ContentWrapper"
})(["display:flex;flex-direction:column;gap:12px;"]);
const SpamProtectionText = styled.div.withConfig({
  displayName: "PillLauncherExpandedView__SpamProtectionText"
})(["font-size:12px;line-height:24px;font-weight:300;color:", ";text-align:center;margin-top:-12px;"], NEUTRAL_800);
const LauncherWrapper = styled.div.withConfig({
  displayName: "PillLauncherExpandedView__LauncherWrapper"
})(["width:100%;"]);
const PillLauncherExpandedView = ({
  isVisible,
  onOpen,
  recommendedQuestionsForAgent = [],
  onPromptClick,
  coloring,
  placeholder,
  consentConfig,
  spamProtectionEnabled = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const locale = useChatWidgetLocale();
  useEffect(() => {
    if (isVisible) {
      const rafId = requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);
  if (!isVisible) {
    return null;
  }
  const handlePromptClick = promptText => {
    if (onPromptClick) {
      onPromptClick(promptText);
    }
  };
  const hasPrompts = recommendedQuestionsForAgent.length > 0;
  return /*#__PURE__*/_jsxs(Container, {
    isVisible: isAnimating,
    spamProtectionEnabled: spamProtectionEnabled,
    "data-test-id": "pill-launcher-expanded-container",
    children: [consentConfig && /*#__PURE__*/_jsx(ConsentPromptV2, {
      variant: WELCOME_MESSAGE,
      consentMessage: consentConfig.consentMessage,
      showConsentButton: consentConfig.showConsentButton,
      onConsentAccept: consentConfig.onConsentAccept,
      accentColor: consentConfig.accentColor,
      showSpamProtection: false,
      showDivider: false,
      isAIChatBot: consentConfig.isAIChatBot,
      usePillLauncher: true
    }), hasPrompts && /*#__PURE__*/_jsx(ContentWrapper, {
      children: /*#__PURE__*/_jsx(AIPromptRecommendations, {
        recommendedQuestionsForAgent: recommendedQuestionsForAgent,
        onPromptClick: handlePromptClick,
        shouldShow: true,
        widgetLocation: LEFT_ALIGNED,
        coloring: coloring
      })
    }), /*#__PURE__*/_jsx(LauncherWrapper, {
      children: /*#__PURE__*/_jsx(PillLauncherV2, {
        onOpen: onOpen,
        placeholder: placeholder,
        "data-test-id": "expanded-container-launcher"
      })
    }), spamProtectionEnabled && /*#__PURE__*/_jsx(SpamProtectionText, {
      "data-test-id": "expanded-container-spam-protection",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.spamProtectionEnabled",
        options: {
          locale
        }
      })
    })]
  });
};
PillLauncherExpandedView.displayName = 'PillLauncherExpandedView';
export default PillLauncherExpandedView;