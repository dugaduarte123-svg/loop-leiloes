// These are passed as query param strings from conversations-embed

export const createWidgetUiState = (overrides = {}) => Object.assign({
  apiEnableWidgetCookieBanner: 'false',
  domain: undefined,
  hideScrollToButton: true,
  hideWelcomeMessage: false,
  isAttachmentDisabled: false,
  isEmbeddedInProduct: false,
  isFullscreen: false,
  isIOSMobile: false,
  isInCMS: false,
  isInitialInputFocusDisabled: false,
  mobile: false,
  mode: undefined,
  open: false,
  startOpen: undefined,
  url: '',
  userInteractedWithWidget: false
}, overrides);
export const getWidgetUiState = state => state.widgetUi;