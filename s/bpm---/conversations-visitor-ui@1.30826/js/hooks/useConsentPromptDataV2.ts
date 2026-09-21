import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import I18n from 'I18n';
import { getConsentToProcessMessage } from '../gdpr/selectors/getConsentToProcessMessage';
import { getCookieConsentPromptMessage } from '../gdpr/selectors/getCookieConsentPromptMessage';
import { getShowGdprConsentToProcess } from '../gdpr/selectors/getShowGdprConsentToProcess';
// @ts-ignore untyped file
import { getGdprConsentToProcessEnabledForChatflow } from '../gdpr/selectors/getGdprConsentToProcessEnabledForChatflow';
import { getUserHasGivenConsentToProcess } from '../gdpr/selectors/getHasUserGivenConsentToProcess';
import { shouldRequireExplicitCookieConsent } from '../selectors/widgetDataSelectors/shouldRequireExplicitCookieConsent';
// @ts-ignore untyped file
import { consentToProcess as onConsentToProcess } from '../gdpr/actions/visitorConsentsToProcess';
import { consentToCookies as onConsentToCookies } from '../gdpr/actions/visitorConsentsToCookies';
import { closeConsentToProcess as closeConsentToProcessAction } from '../gdpr/actions/visitorClosesConsentToProcess';
import { getLatestWidgetData } from '../widget-data/selectors/getLatestWidgetData';
import { getSpamProtectionMetadata } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { useChatWidgetLocale } from 'conversations-visitor-experience-components/visitor-widget/ChatWidgetLocaleContext';
export function useConsentPromptDataV2() {
  const dispatch = useDispatch();
  const locale = useChatWidgetLocale();
  const consentToProcessMessage = useSelector(getConsentToProcessMessage);
  const cookieConsentPromptMessage = useSelector(getCookieConsentPromptMessage);
  const showGdprConsentToProcessButton = useSelector(getShowGdprConsentToProcess);
  const renderCookieConsentPrompt = useSelector(shouldRequireExplicitCookieConsent);
  const showingGdprProcess = useSelector(state => getGdprConsentToProcessEnabledForChatflow(state) && !getUserHasGivenConsentToProcess(state));
  const widgetData = useSelector(getLatestWidgetData);
  const spamProtectionMetadata = getSpamProtectionMetadata(widgetData);
  const spamProtectionEnabled = Boolean(spamProtectionMetadata === null || spamProtectionMetadata === void 0 ? void 0 : spamProtectionMetadata.token);
  const consentRequired = Boolean(renderCookieConsentPrompt || showingGdprProcess);
  const shouldHideQuickReplies = Boolean(renderCookieConsentPrompt || showingGdprProcess && showGdprConsentToProcessButton);
  const showConsentButton = Boolean(renderCookieConsentPrompt || showGdprConsentToProcessButton);
  const consentMessage = useMemo(() => {
    if (renderCookieConsentPrompt) {
      return cookieConsentPromptMessage || I18n.text('conversations-visitor-experience-components.gdpr.consentToCookies.pageLoadCookieConsent', {
        locale
      });
    }
    if (showingGdprProcess) {
      return consentToProcessMessage;
    }
    return '';
  }, [renderCookieConsentPrompt, cookieConsentPromptMessage, showingGdprProcess, consentToProcessMessage, locale]);
  const consentToProcess = useCallback(() => dispatch(onConsentToProcess()), [dispatch]);
  const consentToCookies = useCallback(() => dispatch(onConsentToCookies()), [dispatch]);
  const closeConsentToProcess = useCallback(() => dispatch(closeConsentToProcessAction()), [dispatch]);
  const handleConsentAccept = useCallback(() => {
    if (renderCookieConsentPrompt) {
      consentToCookies();
    } else {
      consentToProcess();
    }
  }, [renderCookieConsentPrompt, consentToCookies, consentToProcess]);
  return {
    consentToProcessMessage,
    cookieConsentPromptMessage,
    showGdprConsentToProcessButton,
    showingGdprProcess,
    renderCookieConsentPrompt,
    consentRequired,
    shouldHideQuickReplies,
    showConsentButton,
    consentMessage,
    spamProtectionEnabled,
    consentToProcess,
    consentToCookies,
    closeConsentToProcess,
    handleConsentAccept
  };
}