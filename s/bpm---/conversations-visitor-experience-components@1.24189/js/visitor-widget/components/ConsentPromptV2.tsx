import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { formatHtml } from 'sanitize-text/sanitizers/HtmlSanitizer';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExLoadingButton from 'visitor-ui-component-library/button/VizExLoadingButton';
import { createThemeV2 } from 'visitor-ui-component-library/theme/createThemeV2';
import { OBSIDIAN, NEUTRAL_400, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { getCanReadTextOnce } from 'visitor-ui-component-library/utils/colors';
import VizExSmall from 'visitor-ui-component-library/typography/VizExSmall';
import { useChatWidgetLocale } from '../ChatWidgetLocaleContext';
import { VARIANT_CONFIG } from './consentPromptVariantConfig';
import { WELCOME_MESSAGE, SPOTLIGHT } from '../constants/consentPromptVariants';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const ConsentContainer = styled.div.withConfig({
  displayName: "ConsentPromptV2__ConsentContainer"
})(["display:flex;flex-direction:column;gap:8px;width:100%;position:relative;margin-top:", ";margin-bottom:", ";", ""], ({
  $variant,
  $usePillLauncher
}) => $variant === WELCOME_MESSAGE && !$usePillLauncher ? '16px' : '0', ({
  $variant,
  $isAIChatBot
}) => $variant !== WELCOME_MESSAGE && $variant !== SPOTLIGHT && $isAIChatBot ? '8px' : '0', ({
  $variant,
  theme
}) => $variant === SPOTLIGHT && css(["margin-bottom:", ";padding:", " ", ";background:", ";border-top:1px solid ", ";"], theme.spotlight.spacing.md, theme.spotlight.spacing.md, theme.spotlight.spacing.lg, theme.spotlight.color.bg, theme.spotlight.color.border));
const ConsentDivider = styled.hr.withConfig({
  displayName: "ConsentPromptV2__ConsentDivider"
})(["margin:0;width:100%;border:none;border-top:1px solid ", ";"], NEUTRAL_400);
const ConsentText = styled(VizExSmall).withConfig({
  displayName: "ConsentPromptV2__ConsentText"
})(["display:block;text-align:left;font-weight:", ";font-size:12px;color:", ";line-height:", ";padding-right:", ";p{margin:0;}"], ({
  $variant,
  theme
}) => $variant === SPOTLIGHT ? theme.spotlight.typography.fontWeight.regular : 300, ({
  $variant,
  theme
}) => $variant === SPOTLIGHT ? theme.spotlight.color.mutedChrome : NEUTRAL_1600, ({
  $variant,
  theme
}) => {
  if ($variant === SPOTLIGHT) return theme.spotlight.typography.lineHeight.md;
  return $variant === WELCOME_MESSAGE ? '18px' : '21px';
}, ({
  $hasCloseButton
}) => $hasCloseButton ? '32px' : '0');
const SpamProtectionText = styled.div.withConfig({
  displayName: "ConsentPromptV2__SpamProtectionText"
})(["font-size:12px;line-height:18px;font-weight:500;color:", ";"], NEUTRAL_1600);
const CloseButtonWrapper = styled.div.withConfig({
  displayName: "ConsentPromptV2__CloseButtonWrapper"
})(["position:absolute;top:-2px;right:2px;", ""], ({
  $variant,
  theme
}) => $variant === SPOTLIGHT && css(["top:", ";right:", ";"], theme.spotlight.spacing.xs, theme.spotlight.spacing.xs));
const ConsentPromptV2 = ({
  variant = WELCOME_MESSAGE,
  consentMessage,
  showConsentButton = false,
  onConsentAccept,
  onClose,
  showSpamProtection = false,
  accentColor,
  showDivider = true,
  isAIChatBot = false,
  isPortal53 = false,
  usePillLauncher = false
}) => {
  const locale = useChatWidgetLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setIsSubmitting(false);
  }, [consentMessage]);
  const handleConsentClick = event => {
    event.stopPropagation();
    if (onConsentAccept) {
      setIsSubmitting(true);
      onConsentAccept();
    }
  };
  const variantConfig = VARIANT_CONFIG[variant];
  const isTextReadable = accentColor ? getCanReadTextOnce(accentColor) : false;
  const primaryColor = isTextReadable ? accentColor : OBSIDIAN;
  const isCloseButtonVisible = variantConfig.showCloseButton && !showConsentButton && isPortal53 && !!onClose;
  return /*#__PURE__*/_jsxs(ConsentContainer, {
    $variant: variant,
    $isAIChatBot: isAIChatBot,
    $usePillLauncher: usePillLauncher,
    "data-test-id": "consent-prompt",
    children: [isCloseButtonVisible && /*#__PURE__*/_jsx(CloseButtonWrapper, {
      $variant: variant,
      children: /*#__PURE__*/_jsx(VizExIconButton, {
        size: "sm",
        use: "transparent-on-background",
        onClick: onClose,
        theme: createThemeV2({
          colors: {
            text: NEUTRAL_1600
          }
        }),
        "data-test-id": "consent-prompt-close-button",
        "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.dismiss'),
        children: /*#__PURE__*/_jsx(VizExIcon, {
          size: "xs",
          icon: /*#__PURE__*/_jsx(SVGClose, {})
        })
      })
    }), showDivider && /*#__PURE__*/_jsx(ConsentDivider, {}), consentMessage && /*#__PURE__*/_jsx(ConsentText, {
      $variant: variant,
      $hasCloseButton: isCloseButtonVisible,
      use: "help",
      "data-test-id": "consent-prompt-text",
      dangerouslySetInnerHTML: {
        __html: formatHtml(consentMessage)
      },
      onClick: event => {
        if (event.target.closest('a')) {
          event.stopPropagation();
        }
      }
    }), showConsentButton && /*#__PURE__*/_jsx(VizExLoadingButton, {
      currentState: isSubmitting ? 'submitting' : 'ready',
      use: variantConfig.acceptButtonUse,
      Button: variantConfig.AcceptButtonComponent,
      spinnerSize: variantConfig.spinnerSize,
      onClick: handleConsentClick,
      theme: createThemeV2({
        colors: {
          primary: variantConfig.resolvePrimaryColor(primaryColor)
        }
      }),
      "data-test-id": "consent-prompt-accept-button",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.buttons.agree",
        options: {
          locale
        }
      })
    }), showSpamProtection && /*#__PURE__*/_jsx(SpamProtectionText, {
      "data-test-id": "consent-prompt-spam-protection",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.spamProtectionEnabled",
        options: {
          locale
        }
      })
    })]
  });
};
ConsentPromptV2.displayName = 'ConsentPromptV2';
export default ConsentPromptV2;