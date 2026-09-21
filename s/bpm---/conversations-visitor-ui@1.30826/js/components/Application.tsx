import { Component } from 'react';
import I18n from 'I18n';
import setDocumentTitle from 'I18n/utils/setDocumentTitle';
import { isTypeBot } from 'conversations-internal-schema/responders/operators/isTypeBot';
import Raven from 'raven-js';
import { isInSDK } from 'visitor-ui-component-library/utils/isInSDK';
import { WIDGET_DATA, REFRESH_WIDGET_DATA, REQUEST_OPEN, REQUEST_CLOSE, BROWSER_WINDOW_RESIZE, SCROLL_PERCENTAGE_CHANGE, EXIT_INTENT, PERF_ATTRIBUTES, HUBSPOT_UTK, GLOBAL_COOKIE_OPT_OUT, FIRST_VISITOR_SESSION, TRACK_API_USAGE, OPEN_TO_NEW_THREAD, VISITOR_IDENTIFICATION_ATTRIBUTES, TRACK_WIDGET_DRAGGED, KB_RELATED_ARTICLE_CLICKED, SPEECH_POC, SCREEN_CAPTURE_BLOB, ENTRY_URL_METADATA, SET_INPUT_TEXT, OPEN_TO_KB_CONTENT } from '../constants/PostMessageTypes';
import { PLAY_BUTTON_PLAY, PLAY_BUTTON_PAUSE, SPEECH_POC_ACTIVE, AUDIO_PLAYBACK_STARTED, AUDIO_PLAYBACK_COMPLETE, SPEECH_TO_TEXT_RESULT, MIC_BUTTON_CLICK, MIC_BUTTON_STOP } from '../external-api-events/constants/externalApiEventTypes';
// @ts-ignore not typed
import { buildWidgetData } from '../widget-data/operators/buildWidgetData';
import { getIsPortal53 } from '../widget-data/operators/getIsPortal53';
import { EVENT_NAMES } from '../usage-tracking/constants/eventNames';
import ApplicationLayout from './ApplicationLayout';
// @ts-ignore not typed
import CheckerContainer from '../react-rhumb/containers/CheckerContainer';
import ThemeProvider from './ThemeProvider';
import { trackApiInteraction } from '../usage-tracking/utils/trackApiInteraction';
import { handleRequestWidget } from '../post-message/handleRequestWidget';
import { handleI18nLabels } from '../post-message/handleI18nLabels';
import { defaultBrowserWindowContext, BrowserWindowContext } from './BrowserWindowContext';
import { setHubspotUtk } from '../query-params/hubspotUtk';
import { getWindowUrl } from '../query-params/getWindowUrl';
import { getFullUrl } from 'hubspot-url-utils';
import { setGlobalDimension, trackEmbedScriptPerfAttributes } from '../usage-tracking/utils/trackMetric';
import WidgetWrapperSelector from './WidgetWrapperSelector';
import { DetachedWindowProvider } from '../contexts/DetachedWindowProvider';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
function getReferrerOrigin() {
  if (!document.referrer) return null;
  try {
    const origin = new URL(document.referrer).origin;
    // Opaque origins (about:blank, file://) produce the string "null" — do not trust them.
    return origin !== 'null' ? origin : null;
  } catch (_e) {
    // Non-parseable referrer (e.g. custom-scheme WebView strings) — treat as absent.
    return null;
  }
}
class Application extends Component {
  constructor(props) {
    super(props);
    this.setMessageTextExternally = null;
    this.handleI18nLabels = () => {
      handleI18nLabels({
        'conversations-visitor-ui.visitorExperienceAriaLabels.chatWidget': I18n.text('conversations-visitor-ui.visitorExperienceAriaLabels.chatWidget'),
        'conversations-visitor-experience-components.visitorExperienceAriaLabels.drag': I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.drag')
      });
    };
    this.handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      this.props.setWindowVisible(isVisible);
      if (isVisible) {
        this.props.fetchCurrentThreadHistory();
      }
    };
    this.handleDragover = this.handleDragover.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.registerDragDropHandlers = this.registerDragDropHandlers.bind(this);
    this.unregisterDragDropHandlers = this.unregisterDragDropHandlers.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.onOpenUpdate = this.onOpenUpdate.bind(this);
    this.requestWidget = this.requestWidget.bind(this);
    this.onBrowserWindowResize = this.onBrowserWindowResize.bind(this);
    this.onScrollPercentageChange = this.onScrollPercentageChange.bind(this);
    this.onExitIntent = this.onExitIntent.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.openToNewThread = this.openToNewThread.bind(this);
    this.handleSetMessageTextExternally = this.handleSetMessageTextExternally.bind(this);
    this.state = {
      // initially assume the browser is big enough to fit the whole widget
      // then shrink as needed after first paint
      browserWindowHeight: defaultBrowserWindowContext.browserWindowHeight,
      browserWindowWidth: defaultBrowserWindowContext.browserWindowWidth
    };
    this.requestWidget();
  }
  componentDidMount() {
    window.addEventListener('message', this.receiveMessage, false);
    this.registerDragDropHandlers();
    this.handleI18nLabels();
    setDocumentTitle('conversations-visitor-ui.htmlTitle');
    if (document.hidden) {
      this.props.setWindowVisible(false);
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    setGlobalDimension('isInlineEmbeddedWidget', this.props.inline.toString());
    setGlobalDimension('location', isInSDK() ? 'sdk' : 'web');
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage);
    this.unregisterDragDropHandlers();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
  handleDragover(event) {
    event.preventDefault();
  }
  handleDrop(event) {
    event.preventDefault();
  }
  registerDragDropHandlers() {
    window.addEventListener('dragover', this.handleDragover);
    window.addEventListener('drop', this.handleDrop);
  }
  unregisterDragDropHandlers() {
    window.removeEventListener('dragover', this.handleDragover);
    window.removeEventListener('drop', this.handleDrop);
  }
  onOpenUpdate(isOpened) {
    this.props.toggleOpen({
      isOpened,
      isUser: true
    });
  }
  requestWidget() {
    handleRequestWidget();
  }
  onBrowserWindowResize(data) {
    this.setState({
      browserWindowHeight: data.height,
      browserWindowWidth: data.width
    });
  }
  onScrollPercentageChange(data) {
    this.props.handleScrollPercentageChange({
      scrollPercentage: data.scrollPercentage
    });
  }
  onExitIntent() {
    this.props.executeExitIntentTrigger();
  }

  /**
   * Converts dataUrl to a File object and passes it to selectAttachmentFile
   */
  onScreenCaptureBlob({
    dataUrl,
    fileName
  }) {
    const {
      selectAttachmentFile,
      thread
    } = this.props;
    const [meta, base64] = dataUrl.split(',');
    const mimeMatch = meta.match(/:(.*?);/);
    if (!mimeMatch) return;
    const mime = mimeMatch[1];
    const binary = atob(base64);
    const array = Uint8Array.from(binary, c => c.charCodeAt(0));
    const file = new File([array], fileName, {
      type: mime
    });
    selectAttachmentFile({
      file,
      thread,
      source: 'screen_capture'
    });
  }
  onTrackApiUsage(data) {
    trackApiInteraction(data.eventName, data.properties);
  }
  onWidgetDragged(data) {
    this.props.trackInteraction(EVENT_NAMES.DRAGGED_WIDGET, data, false, true);
  }
  openToNewThread() {
    if (!this.props.isViewingStubbedThread) {
      this.props.loadStagedThread();
    }
  }
  handleReceiveWidgetData(widgetData) {
    //Add additional sentry tag - bot or not
    Raven.setExtraContext({
      bot: isTypeBot(widgetData.sendFrom[0])
    });
    const {
      handleReceiveWidgetData,
      visitorIdentity
    } = this.props;
    visitorIdentity.setIsPrivateWidgetLoad(widgetData.privateLoad);
    handleReceiveWidgetData({
      data: widgetData,
      isFirstVisitorSession: visitorIdentity.getIsFirstVisitorSession()
    });
  }
  receiveMessage({
    data: rawData,
    origin
  }) {
    // Prefer document.referrer as the trusted parent origin — set by the browser
    // and not forgeable by the embedding page. When absent (e.g. pages using
    // Referrer-Policy: no-referrer), fall back to the url= query param.
    // Sept 2026 metric data: ~65–75% of widget sessions use this fallback path,
    // confirming it is load-bearing. The fallback is a known bypass when an
    // attacker suppresses the referrer and controls the url= param; a
    // server-side origin allowlist is required before it can be removed.
    const referrerOrigin = getReferrerOrigin();
    const parentOrigin = referrerOrigin !== null && referrerOrigin !== void 0 ? referrerOrigin : getWindowUrl().origin;
    const allowedOrigins = [window.origin, getFullUrl('api'), parentOrigin];
    if (!allowedOrigins.includes(origin)) {
      return;
    }
    let parsedData = null;
    try {
      parsedData = JSON.parse(rawData);
    } catch (_err) {
      // unparseable / unexpected message format
      return;
    }
    if (!parsedData) return;
    const {
      type = null,
      data = null
    } = parsedData;
    switch (type) {
      case PERF_ATTRIBUTES:
        {
          if (data.perfAttributes) {
            trackEmbedScriptPerfAttributes(data.perfAttributes);
          }
          break;
        }
      case WIDGET_DATA:
        this.handleReceiveWidgetData(data);
        break;
      case HUBSPOT_UTK:
        setHubspotUtk(data.utk);
        break;
      case GLOBAL_COOKIE_OPT_OUT:
        this.props.onGlobalCookieOptOut(data.globalCookieOptOut);
        break;
      case FIRST_VISITOR_SESSION:
        this.props.updateIsFirstVisitorSession(data.isFirstVisitorSession);
        this.props.visitorIdentity.setIsFirstVisitorSession(data.isFirstVisitorSession);
        break;
      case VISITOR_IDENTIFICATION_ATTRIBUTES:
        this.props.updateVisitorIdentification(data);
        break;
      case REFRESH_WIDGET_DATA:
        this.props.refreshWidgetData(buildWidgetData(parsedData.data));
        break;
      case REQUEST_OPEN:
        this.onOpenUpdate(true);
        break;
      case REQUEST_CLOSE:
        this.onOpenUpdate(false);
        break;
      case BROWSER_WINDOW_RESIZE:
        this.onBrowserWindowResize(data);
        break;
      case SCROLL_PERCENTAGE_CHANGE:
        this.onScrollPercentageChange(data);
        break;
      case EXIT_INTENT:
        this.onExitIntent();
        break;
      case SCREEN_CAPTURE_BLOB:
        this.onScreenCaptureBlob(data);
        break;
      case TRACK_API_USAGE:
        this.onTrackApiUsage(data);
        break;
      case TRACK_WIDGET_DRAGGED:
        this.onWidgetDragged(data);
        break;
      case OPEN_TO_NEW_THREAD:
        this.openToNewThread();
        break;
      case OPEN_TO_KB_CONTENT:
        this.onOpenUpdate(true);
        this.props.navigateToKBContent(data);
        break;
      case KB_RELATED_ARTICLE_CLICKED:
        this.props.setKBArticle({
          deepLink: data.hashedLink,
          hubSpotContentId: data.hubSpotContentId
        });
        break;
      case SPEECH_POC:
        {
          const speechData = data;
          if (speechData.eventType === PLAY_BUTTON_PLAY) {
            if (this.props.audioPlaybackStatus !== 'playing') {
              this.props.setAudioPlaybackStatus('loading');
            }
          }
          if (speechData.eventType === AUDIO_PLAYBACK_STARTED) {
            this.props.setAudioPlaybackStatus('playing');
          }
          if (speechData.eventType === AUDIO_PLAYBACK_COMPLETE || speechData.eventType === PLAY_BUTTON_PAUSE) {
            this.props.setAudioPlaybackStatus('paused');
          }
          if (speechData.eventType === SPEECH_POC_ACTIVE) {
            this.props.setSpeechPocActive(speechData.isActive);
          }
          if (speechData.eventType === MIC_BUTTON_CLICK) {
            this.props.setSpeechRecordingStatus('recording');
          }
          if (speechData.eventType === MIC_BUTTON_STOP) {
            this.props.setSpeechRecordingStatus('loading');
          }
          if (speechData.eventType === SPEECH_TO_TEXT_RESULT) {
            if (speechData.success && typeof speechData.text === 'string') {
              this.props.setMessageEditorStagingText(speechData.text);
            }
            this.props.setSpeechRecordingStatus('idle');
          }
          break;
        }
      case ENTRY_URL_METADATA:
        this.props.setEntryUrlMetadata({
          title: data.title,
          description: data.description,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        break;
      case SET_INPUT_TEXT:
        {
          const isAllowed = getIsPortal53() || this.props.isUngatedForClosingAgentRefresh && this.props.isClosingAgentSystemChatflow;
          if (!isAllowed) {
            break;
          }
          if (data.text) {
            this.setMessageTextExternally(data.text, data.sendMessage);
          }
          break;
        }
      default:
        break;
    }
  }
  handleSetMessageTextExternally(setTextCallback) {
    this.setMessageTextExternally = setTextCallback;
  }
  renderContent() {
    const {
      inline,
      isOpen,
      mobile,
      onLauncherHover,
      showInitialMessageBubble,
      speechPocActive = false,
      toggleOpen,
      trackUserInteraction,
      widgetLocation,
      launcherType
    } = this.props;
    return /*#__PURE__*/_jsx(ApplicationLayout, {
      inline: inline,
      isOpen: isOpen,
      mobile: mobile,
      onLauncherHover: onLauncherHover,
      showInitialMessageBubble: showInitialMessageBubble,
      speechPocActive: speechPocActive,
      toggleOpen: toggleOpen,
      trackUserInteraction: trackUserInteraction,
      widgetLocation: widgetLocation,
      onSetMessageTextExternally: this.handleSetMessageTextExternally,
      launcherType: launcherType
    });
  }
  render() {
    const {
      shouldRenderContent,
      inline,
      widgetLocation,
      isOpen,
      mobile
    } = this.props;
    return /*#__PURE__*/_jsx(BrowserWindowContext.Provider, {
      value: {
        browserWindowHeight: this.state.browserWindowHeight,
        browserWindowWidth: this.state.browserWindowWidth
      },
      children: /*#__PURE__*/_jsx(DetachedWindowProvider, {
        children: /*#__PURE__*/_jsxs(WidgetWrapperSelector, {
          isOpen: isOpen,
          mobile: mobile,
          inline: inline,
          widgetLocation: widgetLocation,
          children: [/*#__PURE__*/_jsx(CheckerContainer, {}), /*#__PURE__*/_jsx(ThemeProvider, {
            children: shouldRenderContent ? this.renderContent() : null
          })]
        })
      })
    });
  }
}
Application.displayName = 'Application';
Application.contextType = BrowserWindowContext;
export default Application;