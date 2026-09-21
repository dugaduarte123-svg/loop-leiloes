import * as helpers from './common/helpers';
import * as dictionaryInterface from './dictionary';
import * as eventInterface from './event';
import * as identifiersInterface from './identifiers';
import * as loggersInterface from './loggers';
import * as schemas from './schemas';
export const createEventTracker = config => {
  const proxyLogger = helpers.proxyLogger({
    'tracker.client': config.clientName,
    'tracker.name': config.trackerName
  });
  const logDebug = loggersInterface.createDebugLogger(config.logMessage);
  const logError = loggersInterface.createErrorLogger(config.logError, proxyLogger(config.onError));
  const definitionStorage = dictionaryInterface.createDictionaryStorage(config.events);

  // Mutates the Default Tracker Properties so that their RESOLVED values
  // Are only allowed to be what they're defined to be when resolved
  // This includes `nullable` values for some. Some might also be optional fields
  const mutatedDefaultProperties = schemas.trackerPropertiesSchema.mutate(schema => ({
    email: Object.assign({}, schema.email, {
      types: ['string', 'null']
    }),
    hubId: Object.assign({}, schema.hubId, {
      types: ['number', 'null']
    }),
    hstc: Object.assign({}, schema.hstc, {
      types: ['string', 'null']
    }),
    lang: Object.assign({}, schema.lang, {
      types: ['string', 'null']
    }),
    deviceId: Object.assign({}, schema.deviceId, {
      types: ['string', 'null']
    })
  }));
  const isDebugEnabled = typeof config.debug === 'function' ? config.debug() : config.debug;
  const validateProperties = (eventKey, eventProperties) => {
    try {
      // This will derive a schema based on the types of the properties from the Event definition
      // and also add all unknown properties to be validated against all allowed Event Property types
      const propertySchema = definitionStorage.createPropertySchema(eventKey, eventProperties);

      // This mutates the definition schema + unknown properties merging the schema of default properties
      // So that the default properties are also validate against their own shchemas instead of the
      // mutation of "unknown properties" as "default properties" technically do not belong to an event definition
      propertySchema.mutate(schema => Object.assign({}, schema, mutatedDefaultProperties._peek())).validate(eventProperties, `Event "${eventKey}"`);
      return true;
    } catch (error) {
      logError(error, {
        extra: {
          eventKey,
          eventProperties: helpers.replaceSentryValues(eventProperties)
        },
        fingerprint: ['usage-tracker-js', 'tracker:validateProperties', `event:${eventKey}`]
      });
      return false;
    }
  };
  const getDefinition = eventKey => {
    try {
      return definitionStorage.getDefinition(eventKey);
    } catch (error) {
      logError(error, {
        extra: {
          eventKey
        },
        fingerprint: ['usage-tracker-js', 'tracker:getDefinition', `event:${eventKey}`]
      });
      return null;
    }
  };
  const getIdentifiers = (eventKey, eventProperties) => {
    const eventRawIdentifiers = {
      email: eventProperties.email,
      userId: eventProperties.userId,
      hubId: eventProperties.hubId,
      hstc: eventProperties.hstc,
      // If a `deviceId` property is manually provided (such as by the anonymous tracker)
      // then we are allowed to use the deviceId as an identifier. Since by default we do not
      // allow the internally generated `device_id` (metaProperties) to be used as an identifier
      deviceId: eventProperties.deviceId
    };
    const eventConfig = {
      allowUnauthed: config.allowUnauthed,
      isExternalHost: config.isExternalHost
    };
    try {
      return identifiersInterface.createIdentifiers(eventRawIdentifiers, eventConfig);
    } catch (error) {
      logError(error, {
        extra: Object.assign({
          eventRawIdentifiers: helpers.replaceSentryValues(eventRawIdentifiers),
          eventProperties: helpers.replaceSentryValues(eventProperties)
        }, eventConfig),
        fingerprint: ['usage-tracker-js', 'tracker:getIdentifiers', `event:${eventKey}`]
      });
      return null;
    }
  };
  const createEvent = (eventKey, eventDefinition, metaProperties, eventProperties, eventIdentifiers) => {
    try {
      return eventInterface.createEventPayload(eventDefinition, metaProperties, eventProperties, eventIdentifiers);
    } catch (error) {
      logError(error, {
        extra: {
          eventKey,
          eventProperties: helpers.replaceSentryValues(eventProperties),
          eventIdentifiers: helpers.replaceSentryValues(eventIdentifiers ? eventIdentifiers.raw : undefined)
        },
        fingerprint: ['usage-tracker-js', 'tracker:createEvent', `event:${eventKey}`]
      });
      return null;
    }
  };
  const dispatchEvent = (eventKey, eventObject, eventIdentifiers) => {
    try {
      // `config.scheduleEvent` should always be defined, hecne if this throws an error
      // we should definitely throw the error here as it's a configuration error
      config.scheduleEvent(eventKey, eventObject, helpers.pick(config, ['bypassPool', 'isBeforeUnload', 'isExternalHost']));
      helpers.dispatchFunctionAsync(() =>
      // If an user provided an `onScheduled` callback, we should call it
      // this allows users to listen when events get scheduled
      helpers.ensureFn(config.onScheduled)(eventKey));
      return true;
    } catch (error) {
      logError(error, {
        extra: {
          eventKey,
          eventIdentifiers: helpers.replaceSentryValues(eventIdentifiers.raw)
        },
        fingerprint: ['usage-tracker-js', 'tracker:dispatchEvent', `event:${eventKey}`]
      });
      return false;
    }
  };
  const trackEventDefinition = (eventKey, definition, metaProperties, extraProperties) => {
    // Merge properties for validation and identifier extraction purposes only.
    // The actual event creation will receive meta and event properties separately
    // to enforce meta-first precedence and prevent user override of system values.
    const mergedForValidation = helpers.defaults(extraProperties, metaProperties);

    // The `propertiesAreValid` will ensure that all our required identifiers
    // Are scalar values and completely valid and that they follow their schema
    // E.g.: HubID is only allowed to be a number and not a string.
    const identifiers = getIdentifiers(eventKey, mergedForValidation);

    // Event properties include user-provided extra properties plus the eventKey.
    // Meta properties are passed separately to createEvent to ensure they
    // cannot be overridden by user-supplied event properties.
    const eventProperties = Object.assign({}, extraProperties, {
      eventKey
    });

    // We create the Event with separate meta and event properties.
    // The event.ts module will merge them with meta-first precedence,
    // ensuring system-generated values like timestamp cannot be overridden.
    const event = createEvent(eventKey, definition, metaProperties, eventProperties, identifiers || undefined);
    if (identifiers && event) {
      if (isDebugEnabled) {
        logDebug(eventKey, 'Event is being dispatched to be sent.', event);
      }
      return dispatchEvent(eventKey, event, identifiers);
    }
    if (isDebugEnabled) {
      logDebug(eventKey, 'Event was not dispatched.', event || undefined);
    }
    return false;
  };

  // Determines the event class for standalone events.
  // If a valid event class is manually provided, use it.
  // Otherwise, infer from the event key (view-like names become 'view', else 'interaction').
  const resolveEventClass = (eventKey, manualClass) => {
    if (schemas.eventClasses.includes(manualClass)) {
      return manualClass;
    }
    return /(pageView|View|pageview)/.test(eventKey) ? 'view' : 'interaction';
  };
  const trackStandaloneEvent = (appName, eventName, metaProperties, standaloneProperties) => {
    const eventKey = helpers.convertEventNameToEventKey(eventName);
    const eventClass = resolveEventClass(eventKey, standaloneProperties.class);
    const definition = {
      name: eventName,
      namespace: appName,
      class: eventClass,
      version: 'v1',
      properties: {},
      meta: {}
    };
    return trackEventDefinition(`standalone:::${eventKey}`, definition, metaProperties, standaloneProperties);
  };
  const trackDictionaryEvent = (eventKey, metaProperties, filterProperties) => {
    const definition = getDefinition(eventKey);
    if (!definition) {
      return false;
    }

    // Removes all the unknown properties that aren't known to the event definition
    // and reports and warns to the owning team that they're using the tracker incorrectly
    const filteredProperties = filterProperties(definition);

    // Validates the given Properties and check if all the required properties are present
    // and if their types match correctly (when dictionary properties) or if they are valid structures
    const propertiesAreValid = validateProperties(eventKey, filteredProperties);
    if (!propertiesAreValid) {
      return false;
    }
    return trackEventDefinition(eventKey, definition, metaProperties, filteredProperties);
  };
  return {
    trackStandaloneEvent,
    trackDictionaryEvent
  };
};