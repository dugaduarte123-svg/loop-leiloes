import styled from 'styled-components';
import VizExButton from 'visitor-ui-component-library/button/VizExButton';
import { darken } from 'visitor-ui-component-library/utils/colors';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { spotlightTheme } from '../spotlight/theme';
const BaseConsentButton = styled(VizExButton).withConfig({
  displayName: "consentPromptButtons__BaseConsentButton"
})(["align-self:flex-start;font-weight:300;"]);
export const WelcomeMessageButton = styled(BaseConsentButton).withConfig({
  displayName: "consentPromptButtons__WelcomeMessageButton"
})(["height:24px;min-height:24px;padding:0 12px;font-size:12px;line-height:14px;"]);
export const ThreadViewButton = styled(BaseConsentButton).withConfig({
  displayName: "consentPromptButtons__ThreadViewButton"
})(["height:32px;min-height:32px;padding:0 16px;font-size:13px;line-height:18px;"]);
export const SpotlightConsentButton = styled.button.withConfig({
  displayName: "consentPromptButtons__SpotlightConsentButton"
})(["display:flex;align-items:center;justify-content:center;align-self:flex-start;height:32px;padding:0 16px;font-size:14px;font-weight:400;line-height:20px;letter-spacing:0;border:1px solid ", ";border-radius:9999px;background-color:transparent;color:", ";cursor:pointer;transition:background-color 150ms ease;&:hover{background-color:", ";}", ""], spotlightTheme.color.mutedChrome, spotlightTheme.color.ink, darken(spotlightTheme.color.surface, 0.08), getFocusRingStyles({
  ringColor: spotlightTheme.color.ink
}));