import { getHostnameWithoutWww } from '../cookies/operators';
import { isAnyMobile, isIOSMobile as IsIOSMobile, isMobileSafari } from './whichDevice';
import { isEmbeddedInProduct } from './isEmbeddedInProduct';
import { shouldHideWelcomeMessage } from './shouldHideWelcomeMessage';
import { shouldWidgetStartOpen } from './shouldWidgetStartOpen';
import { shouldEmbedInline, shouldBeFullscreen, shouldDisableAttachment, shouldDisableInitialInputFocus, getEnableWidgetCookieBanner, shouldHideScrollToButton, shouldHideNewThreadLink } from '../external-api/settingsHelpers';
import { isInCMS } from './isInCMS';
export function getIframeQueryParams({
  messagesUtk,
  hubspotUtk,
  portalId,
  iframeUuid,
  globalCookieOptOut,
  isFirstVisitorSession,
  hstc
}) {
  const mobile = isAnyMobile();
  const inline = shouldEmbedInline();
  const startOpen = shouldWidgetStartOpen();
  const initialInputFocusDisabled = shouldDisableInitialInputFocus();
  const hideNewThreadLink = shouldHideNewThreadLink();
  const isInitialInputFocusDisabled = inline && initialInputFocusDisabled; // only allow this for inline embed
  if (!inline && initialInputFocusDisabled) {
    // eslint-disable-next-line no-console
    console.warn('hsConversationsSettings: the `disableInitialInputFocus` object is only enabled for use when an `inlineEmbedSelector` object is also set');
  }
  const queryParams = {
    uuid: iframeUuid,
    mobile,
    mobileSafari: isMobileSafari(),
    hideWelcomeMessage: shouldHideWelcomeMessage(),
    hstc,
    domain: getHostnameWithoutWww(),
    inApp53: isEmbeddedInProduct({
      portalId
    }),
    messagesUtk,
    url: window.location.href,
    inline,
    isFullscreen: shouldBeFullscreen(),
    globalCookieOptOut,
    isFirstVisitorSession,
    isAttachmentDisabled: shouldDisableAttachment(),
    isInitialInputFocusDisabled,
    enableWidgetCookieBanner: getEnableWidgetCookieBanner(),
    isInCMS: isInCMS(),
    hideScrollToButton: shouldHideScrollToButton(),
    isIOSMobile: IsIOSMobile()
  };
  if (typeof startOpen !== 'undefined') {
    queryParams.startOpen = startOpen;
  }
  if (hubspotUtk) {
    queryParams.hubspotUtk = hubspotUtk;
  }
  if (hideNewThreadLink) {
    queryParams.hideNewThreadLink = true;
  }
  return queryParams;
}