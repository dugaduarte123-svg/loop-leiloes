import { isAnyMobile } from './utils/whichDevice';
import { SPOTLIGHT_FORM_FACTOR_GATE } from './constants/gates';
import { IFRAME_RESIZE, IFRAME_RESIZE_DRAG_EXPAND, OPEN_CHANGE, CLOSED_WELCOME_MESSAGE, REQUEST_WIDGET, STORE_MESSAGES_COOKIE, STORE_WIDGET_SIZE_PREFERENCE, EXTERNAL_API_EVENT, API_REQUEST, I18N_LABELS, SHOW_PAGE_TITLE_NOTIFICATION, CLEAR_PAGE_TITLE_NOTIFICATION, DRAG_HANDLE_POSITION_CHANGE, SPOTLIGHT_MENU_RESIZE, LIGHTBOX_OPEN, LIGHTBOX_CLOSE, SCREEN_CAPTURE_REQUEST, INPUT_TEXT_CHANGED, RESTORE_SAVED_LAUNCHER_POSITION, RESET_TO_DEFAULT_LAUNCHER_POSITION, SPOTLIGHT_LAYOUT_CHANGED } from './iframe-communication/constants/receivedPostMessageTypes';
import { FIRST_VISITOR_SESSION, REFRESH_WIDGET_DATA, REQUEST_OPEN, REQUEST_CLOSE, BROWSER_WINDOW_RESIZE, SCROLL_PERCENTAGE_CHANGE, EXIT_INTENT, PERF_ATTRIBUTES, OPEN_TO_NEW_THREAD, SET_INPUT_TEXT, VISITOR_IDENTIFICATION_ATTRIBUTES, TRACK_WIDGET_DRAGGED, ENTRY_URL_METADATA, OPEN_TO_KB_CONTENT, WIDGET_SIZE_PREFERENCE } from './iframe-communication/constants/sentPostMessageTypes';
import { PostMessageReceiver } from './iframe-communication/PostMessageReceiver';
import PageTitleNotificationsPlugin from './page-title-notifications/PageTitleNotificationsPlugin';
import { getWidgetDataResponseType } from './operators/getWidgetDataResponseType';
import { getCookie, setCookie } from './cookies/operators';
import { cookies } from './cookies/constants';
import Times from './cookies/times';
import { clearCookies } from './cookies/clearCookies';
import { ACTIVE, LIGHTBOX_EXPANDED, MOBILE, SHADOW_CONTAINER, INTERNAL, WIDGET_HIDE_ON_PRINT, ALIGNED_CENTER_CLASS } from './constants/widgetClassNames';
import { HIDE_WIDGET } from './constants/widgetResponseTypes';
import { setMessagesUtk } from './utk/setMessagesUtk';
import { isEmbeddedInProduct, PORTAL_53 } from './utils/isEmbeddedInProduct';
import { shouldRenderWidget } from './utils/shouldRenderWidget';
import { shouldWidgetStartOpen } from './utils/shouldWidgetStartOpen';
import { PARENT_ID, IFRAME_ID, INLINE_PARENT_ID, INLINE_IFRAME_ID } from './constants/elementSelectors';
import { setupExternalApi } from './external-api/setupExternalApi';
import { flushOnReadyCallbacks } from './external-api/flushOnReadyCallbacks';
import DevLogger from './external-api/DevLogger';
import EventEmitter from './event-emitter/EventEmitter';
import { handleExternalApiEventMessage } from './event-emitter/handleExternalApiEventMessage';
import { fetchWidgetData } from './requests/fetchWidgetData';
import { EVENTS } from './events';
import { throttle } from './utils/throttle';
import { getIframeQueryParams } from './utils/getIframeQueryParams';
import { shouldEmbedInline, getInlineEmbedSelector, shouldLoadImmediately } from './external-api/settingsHelpers';
import ScrollPercentageTracker from './scroll-percentage/ScrollPercentageTracker';
import ExitIntentTracker from './exit-intent/ExitIntentTracker';
import { markEndPostDelay } from './perf/markEnd';
import { setClassInClassList } from './operators/setClassInClassList';
import { WIDGET_LOCATION } from './constants/widgetDataKeys';
import { resetAndLaunchWidget } from './utk/resetAndLaunchWidget';
import { RESET_WIDGET } from './constants/extendedFunctions';
import { ApiUsageTracker } from './external-api/ApiUsageTracker';
import { PostMessageApiClient } from './iframe-communication/PostMessageApiClient';
import { sendWidgetDataToIframe } from './postMessageMethods/sendWidgetDataToIframe';
import { registerCookieListeners } from './cookies/registerCookieListeners';
import { registerHashChangeListener } from './event-listener/registerHashChangeListener';
import { registerBfcacheRestoreListener } from './event-listener/registerBfcacheRestoreListener';
import { registerWindowResizeListener } from './event-listener/registerWindowResizeListener';
import { iframeMessagePool } from './postMessageQueue/iframeMessagePool';
import { postMessageToVisitorWindow } from './postMessageQueue/postMessageToVisitorWindow';
import { hideWelcomeMessage } from './utils/hideWelcomeMessage';
import { resizeWidgetIframe } from './utils/resizeWidgetIframe';
import { handleTargetingAndDelay } from './utils/handleTargetingAndDelay';
import { getGlobalCookieOptOut } from './utk/getGlobalCookieOptOut';
import { NEVER } from 'conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes';
import { deleteCookie } from './cookies/deleteCookie';
import { WIDGET_HIDDEN, INPUT_TEXT_CHANGED as INPUT_TEXT_CHANGED_EVENT } from './event-emitter/constants/eventTypeConstants';
import { getExternalApiSettings } from './external-api/getExternalApiSettings';
import { ScreenCapturePlugin } from './screen-capture/ScreenCapturePlugin';
import { NEUTRAL_800 } from 'visitor-ui-component-library/constants/WidgetColors';
import { PILL, DEFAULT, SPOTLIGHT } from 'conversations-internal-schema/widget-data/constants/launcherTypes';
const HELP_WIDGET_ID = 'help-widget';
const noop = () => {};
export class WidgetShell {
  constructor(embedScriptContext, errorLogger, eventEmitter) {
    this.handleDragStart = e => {
      const parent = document.getElementById(PARENT_ID);
      this.isDragging = true;
      const isRightAligned = this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED';
      this.offsetX = isRightAligned ? parent.getBoundingClientRect().right - e.clientX : e.clientX - parent.getBoundingClientRect().left;
      this.offsetY = parent.getBoundingClientRect().bottom - e.clientY;

      // Show Drag Overlay
      if (this.dragOverlayEl instanceof HTMLDivElement) {
        this.dragOverlayEl.style.setProperty('display', 'block');
      }
      if (this.dragHandleEl instanceof HTMLDivElement) {
        this.dragHandleEl.style.setProperty('cursor', 'grabbing');
      }
    };
    this.handleDragEnd = () => {
      if (!this.dragHandleEl || !this.isDragging) {
        return;
      }
      this.iframeMessage.post(TRACK_WIDGET_DRAGGED, {
        // eslint-disable-next-line compat/compat
        timeOnPage: performance && Math.round(performance.now() / 1000),
        isOpen: this.isOpen || false
      });
      this.dragHandleEl.style.setProperty('cursor', 'grab');
      if (this.dragOverlayEl instanceof HTMLDivElement) {
        this.dragOverlayEl.style.setProperty('display', 'none');
      }
      this.isDragging = false;
      const isRightAligned = this.widgetData ? this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      const cookieKey = `${cookies.WIDGET_POSITION}_${widgetAlignment}`;
      const parentEl = document.getElementById(PARENT_ID);
      const style = window.getComputedStyle(parentEl);
      const bottom = parseInt(style.bottom, 10);
      const horizontal = isRightAligned ? parseInt(style.right, 10) : parseInt(style.left, 10);
      if (!horizontal && !bottom) {
        parentEl.style.removeProperty(widgetAlignment);
        parentEl.style.removeProperty('bottom');
        deleteCookie(cookieKey);
      } else {
        setCookie(cookieKey, JSON.stringify({
          bottom,
          horizontal
        }), Times.THIRTY_MINUTES);
      }
    };
    this.handleDrag = e => {
      if (!this.isDragging) return;
      const parent = document.getElementById(PARENT_ID);
      const isRightAligned = this.widgetData ? this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      const horizontal = isRightAligned ? window.innerWidth - e.clientX - this.offsetX : e.clientX - this.offsetX;
      const bottom = window.innerHeight - e.clientY - this.offsetY;
      parent.style.setProperty(widgetAlignment, `${Math.min(Math.max(0, horizontal), window.innerWidth - parent.clientWidth)}px`, 'important');
      parent.style.setProperty('bottom', `${Math.min(Math.max(0, bottom), window.innerHeight - parent.clientHeight)}px`, 'important');
      parent.style.setProperty('position', 'fixed', '!important');
    };
    this.unintializeDrag = () => {
      if (!this.dragHandleEl) {
        return;
      }
      this.dragHandleEl.removeEventListener('mousedown', this.handleDragStart);
      window.removeEventListener('mousemove', this.handleDrag);
      window.removeEventListener('mouseup', this.handleDragEnd);
      window.removeEventListener('mouseleave', this.handleDragEnd);
      this.dragHandleEl.remove();
    };
    this.isSpotlight = () => {
      var _this$widgetData, _this$widgetData2;
      const gates = (_this$widgetData = this.widgetData) === null || _this$widgetData === void 0 ? void 0 : _this$widgetData.gates;
      const message = (_this$widgetData2 = this.widgetData) === null || _this$widgetData2 === void 0 ? void 0 : _this$widgetData2.message;
      return (gates === null || gates === void 0 ? void 0 : gates[SPOTLIGHT_FORM_FACTOR_GATE]) && (message === null || message === void 0 ? void 0 : message.launcherType) === SPOTLIGHT;
    };
    this.initalizeDrag = () => {
      const {
        draggable
      } = this.widgetData;
      if (!draggable || this.isSpotlight() || isAnyMobile() || getExternalApiSettings().isFullscreen) {
        return;
      }

      // Create Drag Handle Element
      this.dragHandleEl = document.createElement('div');
      this.dragHandleEl.classList.add('hs-drag-handle');
      this.dragHandleEl.title = 'Drag';
      this.dragHandleEl.style.setProperty('color', NEUTRAL_800);
      this.dragHandleEl.innerHTML = `
    <svg width="12" height="20" viewBox="0 0 6 10" fill="${NEUTRAL_800}" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.62497 1.20703C5.62497 1.68828 5.23122 2.08203 4.74997 2.08203C4.26872 2.08203 3.87497 1.68828 3.87497 1.20703C3.87497 0.725781 4.26872 0.332031 4.74997 0.332031C5.23122 0.332031 5.62497 0.725781 5.62497 1.20703ZM1.83185 1.20703C1.83185 1.68828 1.4381 2.08203 0.956848 2.08203C0.475598 2.08203 0.0818481 1.68828 0.0818481 1.20703C0.0818481 0.725781 0.475598 0.332031 0.956848 0.332031C1.4381 0.332031 1.83185 0.725781 1.83185 1.20703ZM5.62497 5.00016C5.62497 5.48141 5.23122 5.87516 4.74997 5.87516C4.26872 5.87516 3.87497 5.48141 3.87497 5.00016C3.87497 4.51891 4.26872 4.12516 4.74997 4.12516C5.23122 4.12516 5.62497 4.51891 5.62497 5.00016ZM1.83185 5.00016C1.83185 5.48141 1.4381 5.87516 0.956848 5.87516C0.475598 5.87516 0.0818481 5.48141 0.0818481 5.00016C0.0818481 4.51891 0.475598 4.12516 0.956848 4.12516C1.4381 4.12516 1.83185 4.51891 1.83185 5.00016ZM5.62497 8.79328C5.62497 9.27453 5.23122 9.66828 4.74997 9.66828C4.26872 9.66828 3.87497 9.27453 3.87497 8.79328C3.87497 8.31203 4.26872 7.91828 4.74997 7.91828C5.23122 7.91828 5.62497 8.31203 5.62497 8.79328ZM1.83185 8.79328C1.83185 9.27453 1.4381 9.66828 0.956848 9.66828C0.475598 9.66828 0.0818481 9.27453 0.0818481 8.79328C0.0818481 8.31203 0.475598 7.91828 0.956848 7.91828C1.4381 7.91828 1.83185 8.31203 1.83185 8.79328Z"/>
    </svg>
    `;

      // Create Drag Overlay Element
      this.dragOverlayEl = document.createElement('div');
      this.dragOverlayEl.classList.add('hs-drag-overlay');

      // Add Drag Handle and Overlay to Widget
      const parent = document.getElementById(PARENT_ID);
      parent.appendChild(this.dragOverlayEl);
      parent.appendChild(this.dragHandleEl);
      parent.style.setProperty('user-select', 'none');

      // Add Event Listeners
      this.dragHandleEl.addEventListener('mousedown', this.handleDragStart);
      window.addEventListener('mousemove', this.handleDrag);
      window.addEventListener('mouseup', this.handleDragEnd);
      window.addEventListener('mouseleave', this.handleDragEnd);
    };
    this.getDefaultSize = () => {
      return {
        width: 100,
        height: 96
      };
    };
    this.getStartPosition = () => {
      if (!this.widgetData.draggable || isAnyMobile() || getExternalApiSettings().isFullscreen) {
        return null;
      }
      const isRightAligned = this.widgetData ? this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED' : 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      const cookieKey = `${cookies.WIDGET_POSITION}_${widgetAlignment}`;
      const cookie = getCookie(cookieKey);
      if (cookie) {
        try {
          return JSON.parse(cookie);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error parsing cookie', e);
          return null;
        }
      } else {
        return null;
      }
    };
    this.loadIFrame = () => {
      if (isAnyMobile()) {
        document.documentElement.classList.add(MOBILE);
      }
      const iframe = document.createElement('iframe');
      this.iframeSrc = this.embedScriptContext.getIFrameSrc();
      iframe.src = this.iframeSrc;
      iframe.id = IFRAME_ID;
      iframe.title = 'Chat Widget';
      iframe.allowFullscreen = true;
      iframe.setAttribute('data-test-id', 'chat-widget-iframe');
      iframe.addEventListener('load', this.handleIframeLoad);
      const parent = document.createElement('div');
      parent.role = 'region';
      parent.ariaLabel = 'Chat Widget';
      parent.style.colorScheme = 'light';

      /**
       * Inline embed
       */
      if (shouldEmbedInline()) {
        const embedElement = document.querySelector(getInlineEmbedSelector());
        if (!embedElement) {
          this.devLogger.error(`cannot embed widget - element at \`${getInlineEmbedSelector()}\` cannot be found`);
          return;
        }
        parent.id = INLINE_PARENT_ID;
        iframe.id = INLINE_IFRAME_ID;
        this.iframe = parent.appendChild(iframe);
        embedElement.appendChild(parent);
        return;
      }

      /**
       * Normal embed
       */
      if (document.getElementById(PARENT_ID)) {
        // eslint-disable-next-line no-console
        console.warn(`Element with id ${PARENT_ID} already exists. Unable to load HubSpot Conversations Widget.`);
        return;
      }
      parent.id = PARENT_ID;
      if (getExternalApiSettings().shouldHideChatOnPrint) {
        parent.classList.add(WIDGET_HIDE_ON_PRINT);
      }
      const startPosition = this.getStartPosition();
      if (startPosition) {
        const isRightAligned = this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED';
        const widgetAlignment = isRightAligned ? 'right' : 'left';
        parent.style.setProperty(widgetAlignment, `${startPosition.horizontal}px`, 'important');
        parent.style.setProperty('bottom', `${startPosition.bottom}px`, 'important');
      }
      const {
        height,
        width
      } = this.getDefaultSize();
      parent.style.minHeight = `${height}px`;
      parent.style.minWidth = `${width}px`;
      const shadowContainer = document.createElement('div');
      shadowContainer.className = SHADOW_CONTAINER;
      const embeddedInProduct = isEmbeddedInProduct(this.embedScriptContext);
      if (embeddedInProduct) {
        parent.classList.add(INTERNAL);
        shadowContainer.classList.add(INTERNAL);
      }
      parent.appendChild(shadowContainer);
      if (embeddedInProduct) {
        iframe.id = HELP_WIDGET_ID;
      }
      this.iframe = parent.appendChild(iframe);
      document.body.appendChild(parent);
      this.initalizeDrag();
      this.setFrameClass();
    };
    this.handleI18nLabels = ({
      data
    }) => {
      if (!this.iframe || !data) return;
      const frameLabel = data['conversations-visitor-ui.visitorExperienceAriaLabels.chatWidget'];
      const dragHandleLabel = data['conversations-visitor-experience-components.visitorExperienceAriaLabels.drag'];
      const parent = document.getElementById(shouldEmbedInline() ? INLINE_PARENT_ID : PARENT_ID);
      if (frameLabel) {
        this.iframe.setAttribute('title', frameLabel);
        if (parent) {
          parent.ariaLabel = frameLabel;
        }
      }
      if (dragHandleLabel && this.dragHandleEl) {
        this.dragHandleEl.setAttribute('title', dragHandleLabel);
      }
    };
    this.clampPosition = () => {
      var _this$widgetData3;
      // Do Not Clamp Position if Draggable Chat is not enabled
      if (!((_this$widgetData3 = this.widgetData) !== null && _this$widgetData3 !== void 0 && _this$widgetData3.draggable) || this.isSpotlight() || isAnyMobile() || getExternalApiSettings().isFullscreen) {
        return;
      }
      let hasChanged = false;
      const parent = document.getElementById(PARENT_ID);
      const isRightAligned = this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED';
      if (!parent || !parent.getBoundingClientRect) {
        // Return if parent is not found (or is being used in a test and doesn't have getBoundingClientRect)
        return;
      }
      const {
        top,
        left,
        right
      } = parent.getBoundingClientRect();
      const {
        innerWidth,
        innerHeight
      } = window;
      const {
        clientWidth,
        clientHeight
      } = parent;
      if (top < 0) {
        hasChanged = true;
        parent.style.setProperty('bottom', `${Math.max(innerHeight - clientHeight, 0)}px`, 'important');
      }
      if (isRightAligned && left < 0) {
        hasChanged = true;
        parent.style.setProperty('right', `${Math.max(innerWidth - clientWidth, 0)}px`, 'important');
      }
      if (!isRightAligned && innerWidth - right < 0) {
        hasChanged = true;
        parent.style.setProperty('left', `${Math.max(innerWidth - clientWidth, 0)}px`, 'important');
      }
      if (hasChanged) {
        this.handleDragEnd();
      }
    };
    this.handleClickOutside = event => {
      if (isAnyMobile()) return;
      const parent = document.getElementById(PARENT_ID);
      if (parent && !parent.contains(event.target)) {
        this.requestWidgetClose();
      }
    };
    this.setWidgetData = widgetData => {
      this.widgetData = widgetData;
      this.setFrameClass();
    };
    this.embedScriptContext = embedScriptContext;
    this.detachedVisitorWindow = null;

    // Drag Functionality
    this.dragHandleEl = null;
    this.dragOverlayEl = null;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isOpen = shouldWidgetStartOpen();
    this.spotlightMenuHeight = null;
    this.iframe = null;
    this.iframeSrc = null;
    this.hasLoadedIframe = false;
    this.isLoadingIframe = false;
    this.requestWidgetOpen = this.requestWidgetOpen.bind(this);
    this.requestWidgetClose = this.requestWidgetClose.bind(this);
    this.requestWidgetRefresh = throttle(this.requestWidgetRefresh.bind(this), 1000);
    this.requestSetInputText = this.requestSetInputText.bind(this);
    this.handleBfcacheRestore = this.handleBfcacheRestore.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleIframeLoad = this.handleIframeLoad.bind(this);
    this.handleResizeMessage = this.handleResizeMessage.bind(this);
    this.handleResizeDragExpand = this.handleResizeDragExpand.bind(this);
    this.handleStoreWidgetSizePreference = this.handleStoreWidgetSizePreference.bind(this);
    this.handleOpenChange = this.handleOpenChange.bind(this);
    this.handleStoreMessagesCookie = this.handleStoreMessagesCookie.bind(this);
    this.handleRequestWidget = this.handleRequestWidget.bind(this);
    this.handleWidgetRefresh = this.handleWidgetRefresh.bind(this);
    this.setWidgetNotLoaded = this.setWidgetNotLoaded.bind(this);
    this.removeIframe = this.removeIframe.bind(this);
    this.handleExternalApiEventMessage = this.handleExternalApiEventMessage.bind(this);
    this.loadWidget = throttle(this.loadWidget.bind(this), 1000);
    this.resetAndReloadWidget = this.resetAndReloadWidget.bind(this);
    this.setWidgetOpenCookie = this.setWidgetOpenCookie.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleExitIntent = this.handleExitIntent.bind(this);
    this.extendedClearCookiesFunction = this.extendedClearCookiesFunction.bind(this);
    this.openToNewThread = this.openToNewThread.bind(this);
    this.handleDragHandlePositionChange = this.handleDragHandlePositionChange.bind(this);
    this.handleSpotlightMenuResize = this.handleSpotlightMenuResize.bind(this);
    this.handleLightboxOpen = this.handleLightboxOpen.bind(this);
    this.handleLightboxClose = this.handleLightboxClose.bind(this);
    this.handleInputTextChanged = this.handleInputTextChanged.bind(this);
    this.handleRestoreSavedLauncherPosition = this.handleRestoreSavedLauncherPosition.bind(this);
    this.handleResetToDefaultLauncherPosition = this.handleResetToDefaultLauncherPosition.bind(this);
    this.handleSpotlightLayoutChanged = this.handleSpotlightLayoutChanged.bind(this);
    this.devLogger = new DevLogger();
    this.eventEmitter = eventEmitter || new EventEmitter();
    this.logError = errorLogger ? errorLogger.logError : noop;
    this.scrollPercentageTracker = new ScrollPercentageTracker({
      onScroll: this.handleScroll
    });
    this.exitIntentTracker = new ExitIntentTracker({
      onExitIntent: this.handleExitIntent
    });
    this.screenCapturePlugin = new ScreenCapturePlugin(this);
    const iframeMessageInner = iframeMessagePool({
      iframeSrc: this.embedScriptContext.getIFrameSrc()
    });
    this.iframeMessage = {
      post: (type, data = {}) => {
        iframeMessageInner.post(type, data);
        this.postToDetachedVisitorWindowIfOpen(type, data);
      }
    };
    this.apiUsageTracker = new ApiUsageTracker({
      postMessageToIframe: this.iframeMessage.post
    });
    const postMessageApiClient = new PostMessageApiClient(this.iframeMessage.post);
    this.pageTitleNotifications = new PageTitleNotificationsPlugin();
    this.postMessageReceiver = new PostMessageReceiver({
      [SHOW_PAGE_TITLE_NOTIFICATION]: this.pageTitleNotifications.handleShow,
      [CLEAR_PAGE_TITLE_NOTIFICATION]: this.pageTitleNotifications.handleClear,
      [REQUEST_WIDGET]: this.handleRequestWidget,
      [REFRESH_WIDGET_DATA]: this.requestWidgetRefresh,
      [IFRAME_RESIZE]: this.handleResizeMessage,
      [IFRAME_RESIZE_DRAG_EXPAND]: this.handleResizeDragExpand,
      [STORE_WIDGET_SIZE_PREFERENCE]: this.handleStoreWidgetSizePreference,
      [OPEN_CHANGE]: this.handleOpenChange,
      [CLOSED_WELCOME_MESSAGE]: hideWelcomeMessage,
      [STORE_MESSAGES_COOKIE]: this.handleStoreMessagesCookie,
      [EXTERNAL_API_EVENT]: this.handleExternalApiEventMessage,
      [API_REQUEST]: postMessageApiClient.makeApiRequest,
      [I18N_LABELS]: this.handleI18nLabels,
      [SCREEN_CAPTURE_REQUEST]: this.screenCapturePlugin.handleScreenCaptureRequest,
      [DRAG_HANDLE_POSITION_CHANGE]: this.handleDragHandlePositionChange,
      [SPOTLIGHT_MENU_RESIZE]: this.handleSpotlightMenuResize,
      [LIGHTBOX_OPEN]: this.handleLightboxOpen,
      [LIGHTBOX_CLOSE]: this.handleLightboxClose,
      [INPUT_TEXT_CHANGED]: this.handleInputTextChanged,
      [RESTORE_SAVED_LAUNCHER_POSITION]: this.handleRestoreSavedLauncherPosition,
      [RESET_TO_DEFAULT_LAUNCHER_POSITION]: this.handleResetToDefaultLauncherPosition,
      [SPOTLIGHT_LAYOUT_CHANGED]: this.handleSpotlightLayoutChanged
    }, {
      allowedOrigin: this.embedScriptContext.getIFrameDomain(),
      iframeUuid: this.embedScriptContext.iframeUuid
    });
    this.exitIntentTracker.registerPostMessageReceivers(this.postMessageReceiver);
    this.scrollPercentageTracker.registerPostMessageReceivers(this.postMessageReceiver);
  }
  handleExternalApiEventMessage(message) {
    handleExternalApiEventMessage(message, {
      eventEmitter: this.eventEmitter
    });
  }
  handleScroll({
    scrollPercentage
  }) {
    this.iframeMessage.post(SCROLL_PERCENTAGE_CHANGE, {
      scrollPercentage
    });
  }

  /**
   *
   * @param {MouseEvent} e
   */

  /**
   *
   * @param {MouseEvent} e
   */

  handleExitIntent() {
    this.iframeMessage.post(EXIT_INTENT);
  }
  getStatus() {
    return {
      loaded: this.hasLoadedIframe,
      pending: this.isLoadingIframe
    };
  }

  /**
   * Provides default size for chat launcher
   * to reduce CLS on page load.
   */

  handleIframeLoad() {
    setTimeout(() => this.eventEmitter.trigger('widgetLoaded', {
      message: 'widget has loaded'
    }));
    this.handleWindowResize();
    this.hasLoadedIframe = true;
    this.isLoadingIframe = false;
    markEndPostDelay();
    this.postPerfAttributes(this.embedScriptContext.getPerfAttributes());
  }
  postPerfAttributes(perfAttributes) {
    // Only send these metrics 50% of the time to
    // stay further away from our New Relic data limit
    if (Math.random() < 0.5) {
      this.iframeMessage.post(PERF_ATTRIBUTES, {
        perfAttributes
      });
    }
  }
  resetAndReloadWidget() {
    this.removeIframe();
    resetAndLaunchWidget();
  }
  removeIframe() {
    this.unintializeDrag();
    document.removeEventListener('mousedown', this.handleClickOutside);
    const iframeContainer = shouldEmbedInline() ? document.getElementById(INLINE_PARENT_ID) : document.getElementById(PARENT_ID);
    if (iframeContainer) {
      iframeContainer.remove();
    }
    this.iframeSrc = null;
    this.hasLoadedIframe = false;
    this.isLoadingIframe = false;
  }
  handleResizeMessage({
    data: {
      height,
      width
    } = {}
  }) {
    resizeWidgetIframe({
      height,
      width
    });
    this.clampPosition();
  }
  handleResizeDragExpand({
    data: {
      height,
      width
    } = {}
  }) {
    resizeWidgetIframe({
      height,
      width
    });
  }
  handleSpotlightMenuResize({
    data: {
      isOpen,
      extraHeight
    } = {}
  }) {
    const parent = document.getElementById(PARENT_ID);
    if (!parent) return;
    if (isOpen) {
      if (this.spotlightMenuHeight == null) {
        this.spotlightMenuHeight = parent.getBoundingClientRect().height;
      }
      parent.style.height = `${this.spotlightMenuHeight + (extraHeight !== null && extraHeight !== void 0 ? extraHeight : 0)}px`;
    } else if (this.spotlightMenuHeight != null) {
      parent.style.height = `${this.spotlightMenuHeight}px`;
      this.spotlightMenuHeight = null;
    }
  }
  handleLightboxOpen() {
    var _document$getElementB;
    (_document$getElementB = document.getElementById(PARENT_ID)) === null || _document$getElementB === void 0 || (_document$getElementB = _document$getElementB.classList) === null || _document$getElementB === void 0 || _document$getElementB.add(LIGHTBOX_EXPANDED);
  }
  handleLightboxClose() {
    var _document$getElementB2;
    (_document$getElementB2 = document.getElementById(PARENT_ID)) === null || _document$getElementB2 === void 0 || (_document$getElementB2 = _document$getElementB2.classList) === null || _document$getElementB2 === void 0 || _document$getElementB2.remove(LIGHTBOX_EXPANDED);
  }
  setWidgetOpenCookie({
    isOpen
  }) {
    setCookie(cookies.IS_OPEN, isOpen, Times.THIRTY_MINUTES);
  }
  handleOpenChange({
    data: {
      isOpen,
      isUser
    }
  }) {
    const html = document.documentElement;
    const parent = document.getElementById(PARENT_ID);
    const shadowContainer = parent.getElementsByClassName(SHADOW_CONTAINER)[0];
    this.isOpen = isOpen;
    if (isUser) {
      this.setWidgetOpenCookie({
        isOpen: this.isOpen
      });
    }
    if (this.isOpen) {
      html.classList.add(ACTIVE);
      shadowContainer.classList.add('active');
    } else {
      html.classList.remove(ACTIVE);
      shadowContainer.classList.remove('active');
      this.handleLightboxClose();
    }
    if (this.isOpen && this.isSpotlight() && !isAnyMobile()) {
      document.addEventListener('mousedown', this.handleClickOutside);
    } else {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
  }
  handleDragHandlePositionChange({
    data: {
      dragHandleState
    }
  }) {
    const {
      draggable,
      routingRuleDefinitionAI,
      message,
      systemChatflow
    } = this.widgetData;
    const launcherType = (message === null || message === void 0 ? void 0 : message.launcherType) || DEFAULT;
    const isAIChatBot = Boolean(routingRuleDefinitionAI);
    const isClosingAgentSystemChatflow = Boolean(systemChatflow);
    const usePillLauncher = (isAIChatBot || isClosingAgentSystemChatflow) && (launcherType === PILL || launcherType === DEFAULT);
    if (!draggable || this.isSpotlight() || isAnyMobile() || getExternalApiSettings().isFullscreen) {
      return;
    }
    const widgetAlignment = this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED' ? 'right' : 'left';
    const removeDragHandleClasses = () => {
      if (this.dragHandleEl) {
        Array.from(this.dragHandleEl.classList).forEach(cls => {
          if (cls.startsWith('hs-drag-handle--')) {
            var _this$dragHandleEl;
            (_this$dragHandleEl = this.dragHandleEl) === null || _this$dragHandleEl === void 0 || _this$dragHandleEl.classList.remove(cls);
          }
        });
      }
    };
    if (this.dragHandleEl) {
      removeDragHandleClasses();
      if (dragHandleState === 'hidden') {
        this.dragHandleEl.style.setProperty('display', 'none');
      } else {
        this.dragHandleEl.style.setProperty('display', 'flex');
      }
      if (usePillLauncher) {
        this.dragHandleEl.classList.add(`hs-drag-handle--v2--${dragHandleState}--${widgetAlignment}`);
      } else {
        this.dragHandleEl.classList.add(`hs-drag-handle--v1--${widgetAlignment}`);
      }
    }
  }
  handleInputTextChanged({
    data: {
      text
    }
  }) {
    this.eventEmitter.trigger(INPUT_TEXT_CHANGED_EVENT, {
      text
    });
  }
  handleRestoreSavedLauncherPosition() {
    var _this$widgetData4;
    if (!((_this$widgetData4 = this.widgetData) !== null && _this$widgetData4 !== void 0 && _this$widgetData4.draggable) || this.isSpotlight() || isAnyMobile() || getExternalApiSettings().isFullscreen) {
      return;
    }
    const parent = document.getElementById(PARENT_ID);
    if (!parent) return;
    const savedPosition = this.getStartPosition();
    if (savedPosition) {
      const isRightAligned = this.widgetData[WIDGET_LOCATION] === 'RIGHT_ALIGNED';
      const widgetAlignment = isRightAligned ? 'right' : 'left';
      parent.style.setProperty(widgetAlignment, `${savedPosition.horizontal}px`, 'important');
      parent.style.setProperty('bottom', `${savedPosition.bottom}px`, 'important');
    }
  }
  handleResetToDefaultLauncherPosition() {
    const parent = document.getElementById(PARENT_ID);
    if (!parent) return;
    parent.style.removeProperty('right');
    parent.style.removeProperty('left');
    parent.style.removeProperty('bottom');
  }
  handleSpotlightLayoutChanged(__message) {}
  handleRequestWidget({
    source,
    data
  }) {
    var _this$iframe$contentW, _this$iframe;
    const iframeContentWindow = (_this$iframe$contentW = (_this$iframe = this.iframe) === null || _this$iframe === void 0 ? void 0 : _this$iframe.contentWindow) !== null && _this$iframe$contentW !== void 0 ? _this$iframe$contentW : null;
    if ((iframeContentWindow == null || source !== iframeContentWindow) && (data === null || data === void 0 ? void 0 : data.isDetachedVisitor) === true) {
      if (this.detachedVisitorWindow && !this.detachedVisitorWindow.closed && this.detachedVisitorWindow !== source) {
        this.logError('handleRequestWidget: replacing an open detached visitor window with a new one');
      }
      this.detachedVisitorWindow = source;
    }
    sendWidgetDataToIframe({
      source,
      widgetData: this.widgetData,
      embedScriptContext: this.embedScriptContext,
      apiUsageTracker: this.apiUsageTracker
    });
    const savedSize = this.getWidgetSizePreference();
    if (savedSize) {
      this.iframeMessage.post(WIDGET_SIZE_PREFERENCE, savedSize);
    }
  }
  getWidgetSizePreference() {
    const raw = getCookie(cookies.WIDGET_SIZE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_unused) {
      return null;
    }
  }
  handleStoreWidgetSizePreference({
    data
  }) {
    setCookie(cookies.WIDGET_SIZE, JSON.stringify(data), Times.SIX_MONTHS);
  }
  postToDetachedVisitorWindowIfOpen(type, data = {}) {
    const detachedTargetWindow = this.detachedVisitorWindow;
    if (!detachedTargetWindow || detachedTargetWindow.closed) {
      this.detachedVisitorWindow = null;
      return;
    }
    try {
      postMessageToVisitorWindow({
        targetWindow: detachedTargetWindow,
        iframeSrc: this.embedScriptContext.getIFrameSrc(),
        type,
        data
      });
    } catch (e) {
      this.logError(`Failed to post ${type} to detached visitor window: ${String(e)}`);
    }
  }
  handleStoreMessagesCookie({
    data
  }) {
    this.embedScriptContext.isFirstVisitorSession = false;
    this.iframeMessage.post(FIRST_VISITOR_SESSION, {
      isFirstVisitorSession: false
    });
    if (getGlobalCookieOptOut() === 'yes' && this.widgetData.gdprConsentOptions.cookieConsentPrompt !== NEVER) {
      window._hsp.push(['showBanner']);
    }
    setMessagesUtk(data);
  }
  requestWidgetOpen() {
    if (this.isOpen) {
      this.devLogger.log('cannot open the widget, it is already open.');
      return;
    }
    this.iframeMessage.post(REQUEST_OPEN);
  }
  requestWidgetClose() {
    if (!this.isOpen) {
      this.devLogger.log('cannot close the widget, it is already closed');
      return;
    }
    this.iframeMessage.post(REQUEST_CLOSE);
  }
  requestOpenToKBContent(data) {
    var _this$widgetData$mess;
    if (!this.hasLoadedIframe) {
      this.devLogger.log('cannot open to knowledge base, widget is not loaded');
      return;
    }
    if (!((_this$widgetData$mess = this.widgetData.message) !== null && _this$widgetData$mess !== void 0 && _this$widgetData$mess.knowledgeBaseEnabled)) {
      this.devLogger.log('cannot open to knowledge base, knowledge base is not enabled');
      return;
    }
    this.iframeMessage.post(OPEN_TO_KB_CONTENT, data);
  }
  requestSetInputText(text, sendMessage) {
    if (!this.iframe) {
      this.devLogger.log('cannot set input text, widget is not loaded');
      return;
    }
    this.iframeMessage.post(SET_INPUT_TEXT, {
      text,
      sendMessage
    });
  }
  handleBfcacheRestore() {
    if (this.embedScriptContext.portalId === PORTAL_53) {
      this.removeIframe();
      window.hubspot_live_messages_running = false;
      this.loadWidget();
    }
  }
  handleWindowResize() {
    const data = {
      height: window.innerHeight,
      width: window.innerWidth
    };
    this.iframeMessage.post(BROWSER_WINDOW_RESIZE, data);
    this.clampPosition();
  }
  requestWidgetRefresh({
    openToNewThread,
    setIdentification = false
  } = {}) {
    const {
      portalId
    } = this.embedScriptContext;
    if (!this.hasLoadedIframe && this.isLoadingIframe) {
      this.devLogger.log('Cannot refresh the widget - it is currently loading.');
      return;
    }
    if (this.hasLoadedIframe) {
      const requestUrl = this.embedScriptContext.getInitialRequestUrl(setIdentification);
      if (setIdentification) {
        this.postVisitorIdentificationAttributes();
      }
      fetchWidgetData({
        requestUrl,
        portalId
      }, widgetData => {
        this.handleWidgetRefresh(widgetData);
        if (openToNewThread) {
          this.openToNewThread();
        }
      });
    } else {
      this.loadWidget();
      if (openToNewThread) {
        this.openToNewThread();
      }
    }
  }
  openToNewThread() {
    this.iframeMessage.post(OPEN_TO_NEW_THREAD);
  }
  extendedClearCookiesFunction(extendedFunction) {
    if (extendedFunction && extendedFunction[RESET_WIDGET]) {
      this.removeIframe();
    }
    clearCookies(extendedFunction);
  }
  handleWidgetRefresh(refreshedWidgetData) {
    this.setWidgetData(refreshedWidgetData);
    const shouldHideWidget = getWidgetDataResponseType(this.widgetData) === HIDE_WIDGET;
    if (shouldHideWidget) {
      this.removeIframe();
    } else {
      this.iframeMessage.post(REFRESH_WIDGET_DATA, Object.assign({}, this.widgetData, getIframeQueryParams(this.embedScriptContext)));
    }
  }
  setWidgetNotLoaded({
    reason,
    description
  }) {
    this.hasLoadedIframe = false;
    this.isLoadingIframe = false;
    if (reason || description) {
      this.eventEmitter.trigger(WIDGET_HIDDEN, {
        reason,
        description
      });
    }
  }

  /*
   * Load widget data for the current page
   *
   * @param {object}   options
   * @param {boolean} [options.widgetOpen] - whether or not the widget should render
   *                                         in an open state on initial load
   */
  loadWidget(options = {}) {
    const {
      portalId
    } = this.embedScriptContext;
    if (this.isLoadingIframe) {
      this.devLogger.log('Cannot load the widget - The widget is already being loaded.');
      return;
    }
    if (this.hasLoadedIframe) {
      this.devLogger.log('Cannot load the widget - the widget has already loaded.');
      return;
    }
    this.isLoadingIframe = true;
    if (options.widgetOpen) {
      this.setWidgetOpenCookie({
        isOpen: true
      });
    }
    fetchWidgetData({
      requestUrl: this.embedScriptContext.getInitialRequestUrl(),
      portalId
    }, handleTargetingAndDelay(this.setWidgetData, this.loadIFrame, this.setWidgetNotLoaded), () => {
      EVENTS.messagesInitialized({
        messageWillRender: false
      });
    });
  }
  start() {
    const {
      shouldRender
    } = shouldRenderWidget(this.embedScriptContext);
    if (!shouldRender) {
      try {
        // Prototype can cause this to fail
        EVENTS.messagesInitialized({
          messageWillRender: false
        });
      } catch (e) {
        this.devLogger.log(`widget load aborted`);
      }
      return;
    }
    setupExternalApi({
      debug: this.devLogger.debug,
      on: (eventName, listener) => {
        this.eventEmitter.on(eventName, listener);
        this.apiUsageTracker.trackEventListener(eventName);
      },
      off: this.eventEmitter.off,
      clear: args => {
        this.extendedClearCookiesFunction(args);
        this.apiUsageTracker.trackMethod('clear');
      },
      resetAndReloadWidget: this.resetAndReloadWidget,
      widget: {
        load: (...args) => {
          this.loadWidget(...args);
          this.apiUsageTracker.trackMethod('load');
        },
        remove: () => {
          this.removeIframe();
          this.apiUsageTracker.trackMethod('remove');
        },
        open: () => {
          this.requestWidgetOpen();
          this.apiUsageTracker.trackMethod('open');
        },
        close: () => {
          this.requestWidgetClose();
          this.apiUsageTracker.trackMethod('close');
        },
        refresh: (...args) => {
          this.requestWidgetRefresh(...args);
          this.apiUsageTracker.trackMethod('refresh');
        },
        status: () => {
          this.apiUsageTracker.trackMethod('status');
          return this.getStatus();
        },
        updateEntryUrlMetadata: overrides => {
          this.postEntryUrlMetadata(overrides);
          this.apiUsageTracker.trackMethod('updateEntryUrlMetadata');
        },
        setInputText: (text, sendMessage) => {
          this.requestSetInputText(text, sendMessage);
          this.apiUsageTracker.trackMethod('setInputText');
        },
        openToKnowledgeBase: () => {
          this.requestOpenToKBContent({
            type: 'knowledge-base'
          });
          this.apiUsageTracker.trackMethod('openToKnowledgeBase');
        },
        openToCategory: categoryId => {
          this.requestOpenToKBContent({
            type: 'category',
            categoryId
          });
          this.apiUsageTracker.trackMethod('openToCategory');
        }
      }
    });
    flushOnReadyCallbacks({
      logger: this.devLogger,
      trackCallback: this.apiUsageTracker.trackOnReady
    });
    registerHashChangeListener({
      requestWidgetOpen: this.requestWidgetOpen,
      isOpen: this.isOpen
    });
    registerWindowResizeListener({
      resizeCallbackFn: this.handleWindowResize
    });
    registerBfcacheRestoreListener({
      onRestore: this.handleBfcacheRestore
    });
    registerCookieListeners({
      postMessageToIframe: this.iframeMessage.post
    });
    if (shouldLoadImmediately()) {
      this.loadWidget();
    }
    this.postVisitorIdentificationAttributes();
    this.postEntryUrlMetadata();
    this.registerEntryUrlMetadataObserver();
  }
  postVisitorIdentificationAttributes() {
    const {
      identificationEmail,
      identificationToken
    } = this.embedScriptContext;
    this.iframeMessage.post(VISITOR_IDENTIFICATION_ATTRIBUTES, {
      identificationEmail,
      identificationToken
    });
  }
  postEntryUrlMetadata(overrides) {
    var _document$querySelect;
    const title = typeof (overrides === null || overrides === void 0 ? void 0 : overrides.title) === 'string' ? overrides.title : document.title;
    const description = typeof (overrides === null || overrides === void 0 ? void 0 : overrides.description) === 'string' ? overrides.description : ((_document$querySelect = document.querySelector('meta[name="description"]')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.getAttribute('content')) || '';
    this.iframeMessage.post(ENTRY_URL_METADATA, {
      title,
      description
    });
  }
  registerEntryUrlMetadataObserver() {
    const titleTarget = document.querySelector('title');
    const metaDescTarget = document.querySelector('meta[name="description"]');
    const observer = new MutationObserver(mutations => {
      if (!this.pageTitleNotifications.notificationIntervalIsRunning()) {
        mutations.forEach(() => {
          setTimeout(() => {
            this.postEntryUrlMetadata();
          }, 0);
        });
      }
    });
    if (titleTarget) {
      observer.observe(titleTarget, {
        childList: true
      });
    }
    if (metaDescTarget) {
      observer.observe(metaDescTarget, {
        attributes: true
      });
    }
  }
  setFrameClass() {
    const parent = document.getElementById(PARENT_ID);
    if (!parent) return;
    const widgetLocation = this.widgetData[WIDGET_LOCATION];
    if (this.isSpotlight() && !isAnyMobile()) {
      parent.classList.add(ALIGNED_CENTER_CLASS);
    } else {
      setClassInClassList({
        widgetLocation,
        classList: parent.classList
      });
    }
  }
}