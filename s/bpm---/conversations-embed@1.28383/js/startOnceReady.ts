import { WidgetShell } from './WidgetShell';
import { loadWidgetCss } from './utils/loadWidgetCss';
import { createEmbedScriptContext } from './embed-script-context/createEmbedScriptContext';
import { hasRequiredFeatures } from './utils/hasRequiredFeatures';
import { setupExternalApi } from './external-api/setupExternalApi';
import { getExternalApiSettings } from './external-api/getExternalApiSettings';
import { SETTINGS_VARIABLE, GLOBAL_VARIABLE } from './external-api/constants';
import EventEmitter from './event-emitter/EventEmitter';
import { flushOnReadyCallbacks } from './external-api/flushOnReadyCallbacks';
import DevLogger from './external-api/DevLogger';
import { ErrorLogger } from './error-logging/ErrorLogger';
import { getIsLocal } from './embed-script-context/envGetters';
const widgetNotYetLoadedWarning = () => {
  // eslint-disable-next-line no-console
  console.warn(`loadImmediately is set to false and widget.load() has not been called on window.${GLOBAL_VARIABLE} yet. Please call widget.load() first or set loadImmediately on window.${SETTINGS_VARIABLE} to true.`);
};
function createWidgetShell({
  eventEmitter,
  logError
}) {
  const embedScriptContext = createEmbedScriptContext();
  const widgetShell = new WidgetShell(embedScriptContext, logError, eventEmitter);
  if (!window.hubspot_live_messages_running) {
    window.hubspot_live_messages_running = true;
    widgetShell.start();
  } else {
    // eslint-disable-next-line no-console
    console.warn('duplicate instance of live chat exists on page');
  }
  return widgetShell;
}
function init(logError) {
  loadWidgetCss(document);
  if (!getExternalApiSettings().loadImmediately) {
    const eventEmitter = new EventEmitter();
    const devLogger = new DevLogger();
    setupExternalApi({
      debug: widgetNotYetLoadedWarning,
      on: eventEmitter.on,
      off: eventEmitter.off,
      clear: widgetNotYetLoadedWarning,
      resetAndReloadWidget: widgetNotYetLoadedWarning,
      widget: {
        load: () => {
          const widgetShell = createWidgetShell({
            eventEmitter,
            logError
          });
          widgetShell.loadWidget();
        },
        remove: widgetNotYetLoadedWarning,
        open: widgetNotYetLoadedWarning,
        close: widgetNotYetLoadedWarning,
        refresh: widgetNotYetLoadedWarning,
        status: () => ({
          loaded: false,
          pending: false
        }),
        setInputText: widgetNotYetLoadedWarning,
        updateEntryUrlMetadata: widgetNotYetLoadedWarning,
        openToKnowledgeBase: widgetNotYetLoadedWarning,
        openToCategory: widgetNotYetLoadedWarning
      }
    });
    flushOnReadyCallbacks({
      logger: devLogger
    });
  } else {
    createWidgetShell({
      logError
    });
  }
}
export function startOnceReady() {
  /**
   * Before we do anything else, make sure we're operating in a supported browser
   */
  if (hasRequiredFeatures(window)) {
    // Don't start widget if in KB article proxy endpoint
    const kbEmbedRegex = new RegExp(`^/_hcms/(livechat/embedded-content|customer-agent-embed)$`, 'i');
    if (!kbEmbedRegex.test(window.location.pathname)) {
      const errorLogger = new ErrorLogger();
      if (!getIsLocal()) {
        errorLogger.captureErrors(() => {
          init(errorLogger);
        });
      } else {
        init();
      }
    }
  }
}