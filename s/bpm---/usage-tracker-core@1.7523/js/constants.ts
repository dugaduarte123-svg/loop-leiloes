// These are Event Properties that are sensitive (or that simply should not be sent)
// And should be stripped from the Event Payload all together
// Note: This scrubs properties from `extra_json`
export const SENSITIVE_PROPERTIES = ['email', 'userId', 'hubId', 'hstc', 'utk', 'portalId', 'deviceId', 'device_id', 'last_timestamp_checked_against_session'];

// Optional Fields on the Event Payload
// That are allowed to come from the Event Definition Properties
// And will be stamped directly on the Event Payload
export const OPTIONAL_PAYLOAD_FIELDS = ['what_event_subtype', 'what_value', 'what_value_str', 'where_subscreen2'];

// These are all Properties that are allowed to be sent within `properties`
// Regardless of their respective Event Definition
// Note.: These Properties are always set by the user or by the Tracking Clients
export const ALWAYS_ALLOWED_PROPERTIES = ['userId', 'hubId', 'hstc', 'utk', 'email', 'lang', 'deviceId', 'namespace',
// This is an Amplitude-specific Property related to Session Replay
'[Amplitude] Session Replay ID', '[Amplitude] Session Replay Debug',
// We also add the Optional Payload Fields as technically they're System Properties
// and not "user/event" properties and should always be allowed
...OPTIONAL_PAYLOAD_FIELDS];

// These are all the property types that should not be sent to the Event Payload
// and also filtered out after resolving async properties
export const NOT_ALLOWED_PROPERTY_TYPES = ['function', 'object', 'null', 'undefined'];

// This regex is based on Enviro's domain list, but as a subset of domains
// that are guaranteed to be HubSpot-owned domains and that run Usage Tracking
// @see https://git.hubteam.com/HubSpot/enviro/blob/master/static/js/index.ts#L26-L56
// The (?:^|\.) anchor ensures we only match legitimate HubSpot domains and not
// malicious domains like "fakehubspot.com" or "nothubspot.com"
// Includes international TLDs (.es, .de, .fr, .jp) and connect.com support
export const HUBSPOT_DOMAINS_REGEX = /(?:^|\.)(?:connect(?:qa)?\.com|connectqa\.co|wthubspot\.(?:com|de|fr|jp)|(?:hubspot|hubteam)(?:qa)?\.(?:com|es|de|fr|jp|net)|growth(?:qa)?\.org)$/;

// Used to filter out expired events from the retry mechanism
// We use 6 days to prevent timezones from reaching the 7 days threshold
export const EVENT_CUTOVER_THRESHOLD = 6 * 24 * 60 * 60 * 1000;

// This is the default endpoint used for all tracking clients that don't have a custom endpoint
// and want to send data to Hublytics. Note that usage-tracker-core is not bound to Hublytics
// and theoretically could be used to send data to other services. That simply supports the Event payload.
export const DEFAULT_TRACK_ENDPOINT = '/usage-logging/v1/log/hublytics-multi/no-auth';

// The property name for the Session Replay ID that is injected within an Event
export const SESSION_REPLAY_ID_PROPERTY = '[Amplitude] Session Replay ID';

// Both navigator.sendBeacon and fetch({ keepalive: true }) impose a 64 KiB
// body limit. We use string length as a cheap proxy for byte size — most
// tracking payloads are ASCII so the approximation is close enough, and the
// ~34 KiB margin absorbs any multi-byte undercount. In case other in-flight requests
// are also happening, giving half the bandwidth of availability.
export const MAX_NETWORK_PAYLOAD_SIZE = 30000;