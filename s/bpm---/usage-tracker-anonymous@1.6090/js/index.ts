import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["omitProperties", "scrubProperties"];
import { isHubSpotDomain } from 'usage-tracker-core/client/browserHelper';
import { defaults, mask, omit } from 'usage-tracker-core/common/helpers';
import anonymousTrackingClient from './client';
// These Properties should always be scrubbed during an Anonymous Tracking Session
// Note: Scrubbing means overriding these properties with a specific mask, which
// also will override internal properties with the masked values
export const DEFAULT_SCRUB_PROPERTIES = [
// Properties that can be used to Track User Navigation
'viralSourcePortalId', 'viralSourceUserId', 'referrerUrl', 'referrerParams',
// Properties that are defined internally by `usage-tracker-core`
// on the `metaProperties` generation
'lastPageUrl'];

// These Properties should always be omitted during an Anonymous Tracking Session
// Note: Omitting means removing these properties from user-provided properties
// that can be provided on methods such as `createTracker`, `setProperties` and `track`
export const DEFAULT_OMIT_PROPERTIES = [
// We also want to omit the properties that should be scrubbed
// from being provided by the user, by default
...DEFAULT_SCRUB_PROPERTIES,
// Omit Sensitive Properties that can be defined by the User such as User Identifiable Properties
// Note: These come originally from `SENSITIVE_PROPERTIES` of `usage-tracker-core/constants`
'email', 'userId', 'hubId', 'hstc', 'utk'];
const DEFAULT_OPTS = {
  // Public Applications are allowed to be non-Authenticated
  allowUnauthed: true,
  // Public Applications can run on non-HubSpot App Domains
  // So we do a default check if the App is running on a HubSpot domain
  isExternalHost: !isHubSpotDomain,
  // As `events` is a required property from the TrackerConfig we define it here
  // but as a `undefined` value, so once the validation of TrackerConfig is done
  // it will throw an exception for not having the `events` property supplied.
  // as `undefined` will be interpreted as the value not being provided.
  events: undefined,
  // These Properties should always be scrubbed during an Anonymous Tracking Session
  // Note.: This is a workaround until we have the `usage-tracker-core` refactoring
  omitProperties: DEFAULT_OMIT_PROPERTIES,
  // These Properties should always be scrubbed during an Anonymous Tracking Session
  // Note.: This is a workaround until we have the `usage-tracker-core` refactoring
  scrubProperties: DEFAULT_SCRUB_PROPERTIES
};

// This method allows us to recursively apply a Proxy to Usage Tracker Anonymous
// and allows us to scrub sensitive information from methods that should have sensitive data scrubbed
// Note that scrubbed properties do not need to be re-scrubbed, since by default properties that should
// be scrubbed also take place with the properties that should be omitted, hence once scrubbed, we don't
// need to re-do the process of scrubbing as these properties will never be passed to the original methods
const applyProxy = (config, tracker, omitProperties) => {
  return new Proxy(tracker, {
    get: (target, property) => {
      if (property === 'setProperties') {
        // We omit sensitive properties within the `setProperties` call
        return newProperties => {
          return target.setProperties(omit(newProperties, omitProperties));
        };
      }

      // We override the `track` method to omit sensitive properties
      if (property === 'track') {
        return (...trackArgs) => {
          // We get the properties from the trackArgs array based on the config.standalone value
          const properties = config.standalone ? trackArgs[2] : trackArgs[1];

          // We omit the sensitive properties from the properties object
          const filteredProperties = omit(properties !== null && properties !== void 0 ? properties : {}, omitProperties);

          // We use apply to keep the types loose here so we can dynamically call the
          // right `track` method based on the config.standalone value.
          target.track.apply(null, config.standalone ? [trackArgs[0], trackArgs[1], filteredProperties] : [trackArgs[0], filteredProperties]);
        };
      }
      if (property === 'clone') {
        // We apply the Proxy on a new instance of usage-tracker to keep the same functionality
        return cloneConfig => {
          return applyProxy(cloneConfig, target.clone(cloneConfig), omitProperties);
        };
      }
      return target[property];
    }
  });
};
export const createTracker = config => {
  const _defaults = defaults(config || DEFAULT_OPTS, DEFAULT_OPTS),
    {
      omitProperties,
      scrubProperties
    } = _defaults,
    mergedOptions = _objectWithoutPropertiesLoose(_defaults, _excluded);

  // We filter the `createTracker.properties` param with the properties that
  // should always be omitted. These will also be omitted from user-available
  // methods such as `setProperties` and `track`
  const filteredProperties = omit(mergedOptions.properties,
  // @ts-ignore omit is not handling the type correctly
  omitProperties || DEFAULT_OMIT_PROPERTIES);

  // We create a set of properties that should always be scrubbed (masked)
  // these are sent within `createTracker` so that internal properties are overridden
  // with the masked properties and to avoid sensitive properties from being sent
  const maskedProperties = mask(scrubProperties || DEFAULT_SCRUB_PROPERTIES, null);
  return applyProxy(mergedOptions, anonymousTrackingClient.createTracker(Object.assign({}, mergedOptions, {
    // We merge the filtered properties with the masked properties
    // having the masked properties always taking precedence
    properties: Object.assign({}, filteredProperties, maskedProperties)
  })), omitProperties || DEFAULT_OMIT_PROPERTIES);
};