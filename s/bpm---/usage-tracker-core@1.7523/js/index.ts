import * as browserHelper from './client/browserHelper';
import { dispatchFunctionAsync, isArray, once, splitJsonArrayIntoChunks } from './common/helpers';
import { EVENT_CUTOVER_THRESHOLD, MAX_NETWORK_PAYLOAD_SIZE } from './constants';
import { createEventPool } from './eventPool';
import { createScheduler } from './eventScheduler';
import * as metaPropertiesInterface from './metaProperties';
import { createSafeGuard } from './safeGuard';
import { clientDependenciesSchema } from './schemas';
import * as storageKeys from './storageKeys';
import { createLockedTracker } from './tracker';
export const createClient = (dependencies = {}) => {
  const parsedDependencies = clientDependenciesSchema.normalize(dependencies);
  clientDependenciesSchema.validate(parsedDependencies, '"createClient"');
  const {
    clientName,
    getDebug,
    getEmail,
    getHubId,
    getHstc,
    getLang,
    getCurrentHref,
    getReferrer,
    getUserAgent,
    getNetworkType,
    getNetworkSpeed,
    getScreenWidth,
    getScreenHeight,
    getWindowWidth,
    getWindowHeight,
    getDeployableName,
    getDeployableVersion,
    getHubSpotSessionId,
    getTempStorage,
    logMessage,
    logWarning,
    logError,
    reportError,
    reportWarning,
    send,
    setTempStorage
  } = parsedDependencies;
  const eventPool = createEventPool({
    getTempStorage,
    setTempStorage
  });
  const safeGuard = createSafeGuard({
    getTempStorage,
    setTempStorage
  });
  const {
    scheduleFlush
  } = createScheduler(browserHelper.isDocumentReady, browserHelper.isPrerendering);
  let networkQueue = Promise.resolve();

  // Tracks whether the page is possibly tearing down. Set to 'visibility' on
  // visibilitychange → hidden (reversible — cleared if the page becomes visible
  // again, e.g. tab switch) or 'unload' on beforeunload (terminal — never
  // cleared). When truthy, scheduleEvent routes through the synchronous
  // dispatchUnloadChunk path instead of the async pool/queue.
  let teardownState = false;

  // Yields one event-loop tick between normal-path chunks.
  // This does NOT drain the 64 KiB beacon quota (network I/O won't complete in
  // ~4 ms), but it keeps large batch flushes from monopolising the event loop
  // and gives the browser's beacon scheduler a tick to process prior requests.
  const yieldOneTick = () => new Promise(resolve => setTimeout(resolve, 0));

  // Appends a single chunk to the normal send queue, separated from prior chunks
  // by a one-tick yield so consecutive beacon calls don't all compete for the
  // shared 64 KiB keepalive budget at the same instant. send() is wrapped in a
  // Promise so synchronous throws become rejections caught by .catch(onFailure).
  const enqueueNormalChunk = (events, query, isBeforeUnload, discardOnFailure) => {
    const onFailure = () => {
      if (discardOnFailure === false) {
        safeGuard.addEvents(events);
      }
    };
    const props = {
      query,
      isBeforeUnload,
      onFailure
    };
    networkQueue = networkQueue.then(() => {
      return new Promise(r => r(send(Object.assign({
        events
      }, props)))).catch(onFailure).then(yieldOneTick);
    });
  };

  // Dispatches a single chunk synchronously inside the current event-handler task.
  // sendBeacon is itself synchronous and requires the document to be "fully active".
  // Deferring to a microtask or setTimeout risks the document becoming inactive
  // first — Firefox explicitly aborts queued microtasks on context destruction
  // (WHATWG issue #2087) and all browsers suspend/clear setTimeout callbacks
  // during page teardown. Calling send() synchronously matches the pattern used
  // by GA4, Amplitude, and web-vitals. Synchronous throws are caught inline.
  const dispatchUnloadChunk = (events, query, isBeforeUnload, discardOnFailure) => {
    const onFailure = () => {
      if (discardOnFailure === false) {
        safeGuard.addEvents(events);
      }
    };
    try {
      send({
        events,
        query,
        isBeforeUnload,
        onFailure
      });
    } catch (e) {
      onFailure();
    }
  };
  const sendToNetwork = (payload, options) => {
    const {
      isBeforeUnload = false,
      isExternalHost = false,
      discardOnFailure = false
    } = options;
    let query = `clientSendTimestamp=${Date.now()}`;
    if (isExternalHost) {
      query += '&dil=true';
    }
    const chunks = splitJsonArrayIntoChunks(payload, MAX_NETWORK_PAYLOAD_SIZE);

    // Unload sends are dispatched synchronously (see dispatchUnloadChunk).
    // Normal sends are serialised through the networkQueue promise chain with
    // yieldOneTick pacing (see enqueueNormalChunk).
    const dispatchChunk = isBeforeUnload ? dispatchUnloadChunk : enqueueNormalChunk;
    for (const events of chunks) {
      dispatchChunk(events, query, isBeforeUnload, discardOnFailure);
    }
  };
  const flushPoolAndSendToNetwork = options => {
    const eventsToFlush = eventPool.flush();
    if (eventsToFlush && eventsToFlush.length) {
      // If the pool is empty we shouldn't send an empty request to the server
      // to reduce the amount of spam of events
      sendToNetwork(eventsToFlush, options);
    }
  };
  const sendToPool = (events, options) => {
    events.forEach(event => eventPool.push(event));
    dispatchFunctionAsync(() =>
    // Asynchronously dispatch a timer to flush remaining events in the pool
    // to be flushed and then sent to the network
    scheduleFlush(() => flushPoolAndSendToNetwork(options)));
  };
  const metaPropertiesDependencies = {
    clientName,
    getCurrentHref,
    getReferrer,
    getUserAgent,
    getNetworkType,
    getNetworkSpeed,
    getScreenWidth,
    getScreenHeight,
    getWindowWidth,
    getWindowHeight,
    getDeployableName,
    getDeployableVersion,
    getHubSpotSessionId,
    getTempStorage,
    setTempStorage
  };
  const getStaticMetaPropertiesOnce = once(metaPropertiesInterface.getStaticMetaProperties);
  const getMetaProperties = ({
    deviceId
  }) => {
    // staticProperties = properties that get set once on tracker initialisation
    // this is called as `once` within `getMetaProperties` so that the first call
    // is when the first `.track` method is called on the tracker
    // as maybe, if this method is called exactly when the tracking client is created
    // the App context might not be ready yet.
    const staticMetaProperties = getStaticMetaPropertiesOnce(metaPropertiesDependencies);

    // dynamicProperties = properties that can change for each event
    // These properties are invoked within every single call of the `getMetaProperties`
    // as their nature is transient and they will change for each event
    // @NOTE: It is inefficient within a tracker instance (running within the page)
    // for us to keep calling the Browser Storage API for every single event that gets sent.
    // @TODO: We should cache these values that come from Session Storage and probably find
    // an alternative to sync between tracker instances.
    const dynamicMetaProperties = metaPropertiesInterface.getDynamicMetaProperties(Object.assign({
      // If a `deviceId` property is used, we override the internally generated `device_id`
      // property which is stored within the `metaProperties` object (and localStorage)
      // with the one provided by the user. (This is used by anonymous tracker for example)
      deviceId: deviceId
    }, metaPropertiesDependencies));
    return metaPropertiesInterface.getMetaProperties(staticMetaProperties, dynamicMetaProperties);
  };

  /** @deprecated this is here due to compatibility reasons and soon to be removed */
  const recordDispatchedEvents = (eventKey, event) => {
    try {
      // Attempts to get the localStorage state of the stored Usage Event Keys
      const keysRaw = getTempStorage(storageKeys.recordedEventKeys) || '[]';

      // Always ensures the currentEventsKeys has 50 items or less
      // and that if it has more, the older entries get removed
      const keys = JSON.parse(keysRaw).reverse().slice(0, 49).reverse();
      setTempStorage(storageKeys.recordedEventKeys, JSON.stringify(keys.concat(eventKey)));
    } catch (err) {
      // In the case we failed to parse the recorded Event Keys we purge the Storage
      setTempStorage(storageKeys.recordedEventKeys, '[]');
    }
    try {
      // Attempts to get the localStorage state of the stored Usage Events
      const eventsRaw = getTempStorage(storageKeys.recordedEvents) || '[]';

      // Always ensures the currentEvents has 50 items or less
      // and that if it has more, the older entries get removed
      const events = JSON.parse(eventsRaw).reverse().slice(0, 49).reverse();
      setTempStorage(storageKeys.recordedEvents, JSON.stringify(events.concat(event)));
    } catch (err) {
      // In the case we failed to parse the recorded Events we purge the Storage
      setTempStorage(storageKeys.recordedEvents, '[]');
    }
  };

  // This method exists to proactively send (straight away) remaining Events
  // from different Apps or maybe event the current running App
  // that were not able to be dispatched nor handled by other guard-rails
  const sendEventsThatFailedToSend = options => {
    const leftOverEvents = safeGuard.getEvents();
    if (isArray(leftOverEvents) && leftOverEvents.length > 0) {
      // Remove these Events as they're being dispatched to the Network
      safeGuard.removeEvents(leftOverEvents);
      const currentTime = Date.now();
      const nonExpiredEventsFilter = ({
        when_timestamp = 0
      }) => currentTime - when_timestamp < EVENT_CUTOVER_THRESHOLD;
      const prerenderingEventsFilter = ({
        what_extra_json = ''
      }) => !what_extra_json.includes('"prerendering":true');
      const sendableEvents = leftOverEvents.filter(nonExpiredEventsFilter).filter(prerenderingEventsFilter);

      // Directly send the remainder Events through the Network
      // as they're leftovers from a previous instance of the Tracker
      sendToNetwork(sendableEvents, {
        isExternalHost: options.isExternalHost,
        isBeforeUnload: true,
        discardOnFailure: true
      });
    }
  };
  const scheduleEvent = (eventKey = '', event, options) => {
    const shouldSendImmediately = options.bypassPool || options.isBeforeUnload || teardownState;

    // When tearing down, override isBeforeUnload so sendToNetwork picks
    // dispatchUnloadChunk (synchronous) instead of enqueueNormalChunk (async).
    const effectiveOptions = teardownState ? Object.assign({}, options, {
      isBeforeUnload: true
    }) : options;
    const eventDispatchMethod = shouldSendImmediately ? sendToNetwork : sendToPool;

    // Enqueue the Event or directly dispatch over the Network
    eventDispatchMethod([event], effectiveOptions);

    // Dispatch the Event to whoever that is listening to an Usage Tracker Event
    dispatchFunctionAsync(() => browserHelper.dispatchWindowEvent('usageTrackerEvent', {
      eventKey,
      eventPayload: event
    }));

    // Dispatches the Event to the deprecated/legacy Recorded Events Storage
    dispatchFunctionAsync(() => {
      // We only want to use the legacy way if explicitly requested as this is an
      // internal legacy HubSpot Engineering feature
      if (getTempStorage(storageKeys.recorderEnabled) === 'true') {
        recordDispatchedEvents(eventKey, event);
      }
    });
  };
  return {
    createTracker: config => {
      // This gracefully handles dispatching Events via Browser Beacon when the page is unloading
      // This is a best effort approach, as it is not guaranteed that remaining Events will get dispatched
      // This method is not reliable on Mobile Browsers and some other Edge-cases (like there was no user interaction)
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#usage_notes
      browserHelper.addEventListener('beforeunload', () => {
        if (!browserHelper.isPrerendering()) {
          teardownState = 'unload';
          flushPoolAndSendToNetwork({
            isExternalHost: config.isExternalHost,
            isBeforeUnload: true
          });
        }
      });

      // This handles scenarios when the user changes from one App to another (Mobile) or when
      // they change to another tab on the Browser or minimize the Browser
      // This is a recommend approach by MDN and can handle situations where `beforeunload` is not available
      // @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event#sending_end-of-session_analytics_on_transitioning_to_hidden
      browserHelper.addEventListener('visibilitychange', () => {
        // Page became visible again (e.g. user switched back to this tab).
        // Only clear teardownState if it was set by a previous visibility hide —
        // a beforeunload-triggered 'unload' state is terminal and must not be cleared.
        if (browserHelper.isDocumentVisible()) {
          if (teardownState === 'visibility') {
            teardownState = false;
          }
          return;
        }
        if (!browserHelper.isPrerendering()) {
          // Mark as possibly tearing down, but don't overwrite a terminal 'unload'
          // state that beforeunload may have already set.
          teardownState = teardownState || 'visibility';
          flushPoolAndSendToNetwork({
            isExternalHost: config.isExternalHost,
            isBeforeUnload: true
          });
        }
      });

      // This is another safety guard-rail as in case that both `visibilitychange` and `beforeunload` did not work
      // and in case there are leftover Events by any means, then we verify if these Events still exist
      dispatchFunctionAsync(() => sendEventsThatFailedToSend(config));
      return createLockedTracker({
        clientName,
        getMetaProperties,
        getDebug,
        getEmail,
        getHubId,
        getHstc,
        getLang,
        logError,
        logMessage,
        logWarning,
        reportError,
        reportWarning,
        scheduleEvent
      }, config !== null && config !== void 0 ? config : {});
    }
  };
};