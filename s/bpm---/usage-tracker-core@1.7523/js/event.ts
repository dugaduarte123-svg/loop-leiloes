import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["timestamp", "device_id", "session_id", "last_sequence_number", "last_event_id"],
  _excluded2 = ["namespace", "lang", "screen", "subscreen"];
import * as errors from './common/errors';
import * as helpers from './common/helpers';
import { NOT_ALLOWED_PROPERTY_TYPES, OPTIONAL_PAYLOAD_FIELDS, SENSITIVE_PROPERTIES, SESSION_REPLAY_ID_PROPERTY } from './constants';
import * as storageKeys from './storageKeys';
const resolveNamespace = (eventKey, namespaceFromDefinition, namespaceFromProperties) => {
  const namespace = namespaceFromDefinition || namespaceFromProperties;
  if (!namespace || namespace === '*') {
    throw errors.eventError(`Namespace not found for "${eventKey}".`);
  }
  return namespace;
};

// The Conditional Payload comes from the ConditionalProperties[key]

export const getSessionReplayProperty = ({
  session_id,
  device_id
}, identifiers) => {
  var _identifiers$utk;
  const deviceId = (_identifiers$utk = identifiers === null || identifiers === void 0 ? void 0 : identifiers.utk) !== null && _identifiers$utk !== void 0 ? _identifiers$utk : device_id;
  return {
    [SESSION_REPLAY_ID_PROPERTY]: `${deviceId}/${session_id}`
  };
};
export const applyIdentifiers = (event, identifiers) => {
  if (!event.who_email && identifiers.raw.email) {
    event.who_email = identifiers.raw.email;
  }
  if (!event.who_identifier && identifiers.raw.userId) {
    event.who_identifier = identifiers.raw.userId;
  }
  if (!event.who_identifier_v2) {
    event.who_identifier_v2 = identifiers.user;
  }
  if (!event.who_team_identifier) {
    event.who_team_identifier = identifiers.team;
  }
  if (!event.utk) {
    event.utk = identifiers.utk;
  }
  return event;
};
export const transformEventPayload = (definition, metaProperties, eventProperties) => {
  // Extract root-level payload fields from metaProperties (system-generated, authoritative)
  const {
      timestamp,
      device_id,
      session_id,
      last_sequence_number,
      last_event_id
    } = metaProperties,
    remainingMetaProperties = _objectWithoutPropertiesLoose(metaProperties, _excluded);

  // Extract root-level fields from eventProperties (user-provided)
  const {
      namespace,
      lang,
      screen,
      subscreen
    } = eventProperties,
    remainingEventProperties = _objectWithoutPropertiesLoose(eventProperties, _excluded2);

  // Combine remaining properties from both meta and event for what_extra_json.
  // Event properties are spread first, then meta properties, so that meta
  // properties with the same key will take precedence in what_extra_json.
  const combinedRemainingProperties = Object.assign({}, remainingEventProperties, remainingMetaProperties);

  // Removes sensitive data from the Event Properties and System Properties
  // that should not be part of the `what_extra_json` Event Payload
  const omitedProperties = helpers.omit(combinedRemainingProperties, [...SENSITIVE_PROPERTIES, ...OPTIONAL_PAYLOAD_FIELDS]);

  // This provides the final Event Properties Payload that is part of the Event Payload
  const whatExtraJson = helpers.reduceObject(omitedProperties)((accumulator, key) => {
    let value = omitedProperties[key];
    const valueType = helpers.getRealTypeOf(value);

    // This is a last level firewall to prevent non-intended values
    // to be added to our payload. It removes null, undefined, object and functions
    // from our payload. In general JSON.stringify already removes functions
    // But we want to ensure that things work as expected here
    if (NOT_ALLOWED_PROPERTY_TYPES.includes(valueType)) {
      return accumulator;
    }

    // Ensures that empty strings are not added to our payload
    // Included empty-padded strings or strings only with white spaces
    if (valueType === 'string' && value.trim() === '') {
      return accumulator;
    }
    if (helpers.isArray(value)) {
      // If the value is an Array we remove all the empty items from the Array
      // This time we don't remove empty strings as it could be an intended value
      value = value.filter(item => item !== null && item !== undefined);
    }

    // This will ensure that only non-empty values such as `non-empty strings`
    // Booleans, Numbers and Arrays actually get sent to the server
    accumulator[key] = value;
    return accumulator;
  });

  // Applies the Locale to the JSON payload
  whatExtraJson.locale = lang;
  const payload = {
    hublytics_account_id: storageKeys.accountId,
    where_app: resolveNamespace(eventProperties.eventKey, definition.namespace, namespace),
    where_screen: screen || 'unknown',
    where_subscreen: subscreen || '',
    when_timestamp: timestamp,
    device_id,
    session_id,
    event_id: last_event_id,
    sequence_number: last_sequence_number,
    language: lang,
    what_event: definition.name,
    what_event_class: definition.class.toUpperCase(),
    what_version: definition.version,
    what_extra_json: JSON.stringify(whatExtraJson),
    library_name: 'usage-tracker-js',
    library_version: 1
  };

  // Note.: This manual conversion should not be done
  // to begin with as the property should be only `where_subscreen2`
  // Yet, this cover a historical edge scenario. Note that subscreen2 is not
  // a System Property, hence it should be defined in the Event Definition if used
  if (typeof eventProperties.subscreen2 === 'string') {
    payload.where_subscreen2 = eventProperties.subscreen2;
  }

  // These are optional fields that are allowed to be sent on the Event Payload
  // or set as global properties; These when sent should be treated as System Properties
  // These are also naturally removed from the `what_extra_json` Event Payload
  OPTIONAL_PAYLOAD_FIELDS.forEach(conditionalProperty => {
    const value = eventProperties[conditionalProperty];

    // These Optional fields should always be Strings, as their values
    // are necessarily meant to be strings, hence they should only be defined
    // if they are strings. If they are not strings, they should not be defined
    // Since this is mostly used for internal usage or very specific purposes,
    // we don't need to cover this scenario with a logger warning
    if (typeof value === 'string') {
      payload[conditionalProperty] = value;
    }
  });
  return payload;
};
export const createEventPayload = (definition, metaProperties, eventProperties, identifiers) => {
  // Applies the Session Replay ID within the Event Properties so that it
  // gets added to the Extra JSON and sent to Amplitude
  const eventPropertiesWithSessionReplay = Object.assign({}, eventProperties, getSessionReplayProperty(metaProperties, identifiers));
  const eventPayload = transformEventPayload(definition, metaProperties, eventPropertiesWithSessionReplay);
  if (identifiers) {
    // If identifiers are still not available we still create the payload for debugging purposes
    // But the application should not send this event in any circumstances as it is not identifiable
    return applyIdentifiers(eventPayload, identifiers);
  }
  return eventPayload;
};