import { EXTRA_EXTRA_SMALL, EXTRA_SMALL } from 'visitor-ui-component-library/constants/sizes';
import { spotlightTheme } from '../spotlight/theme';
import { WELCOME_MESSAGE, CHAT_THREAD, SPOTLIGHT } from '../constants/consentPromptVariants';
import { WelcomeMessageButton, ThreadViewButton, SpotlightConsentButton } from './consentPromptButtons';
export const VARIANT_CONFIG = {
  [WELCOME_MESSAGE]: {
    AcceptButtonComponent: WelcomeMessageButton,
    resolvePrimaryColor: primaryColor => primaryColor,
    showCloseButton: false,
    spinnerSize: EXTRA_EXTRA_SMALL
  },
  [CHAT_THREAD]: {
    AcceptButtonComponent: ThreadViewButton,
    resolvePrimaryColor: primaryColor => primaryColor,
    showCloseButton: true,
    spinnerSize: EXTRA_SMALL
  },
  [SPOTLIGHT]: {
    AcceptButtonComponent: SpotlightConsentButton,
    acceptButtonUse: 'secondary',
    resolvePrimaryColor: () => spotlightTheme.color.ink,
    showCloseButton: true,
    spinnerSize: EXTRA_SMALL
  }
};