import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["trackerType", "onBeforeSwitch"];
import { defaults, ensureFn } from 'usage-tracker-core/common/helpers';
import { createHistory } from './history';
import { trackerMap } from './trackers';
const DEFAULT_CONTAINER_OPTS = {
  // We use the `history` package as it allows us to integrate to 3rd party Application
  // history states. This is mostly useful for Anonymous Tracker and to keep states in sync
  history: createHistory(),
  // This defines if we should store the UUID in the URL which allows easy hand-off from different
  // browser sessions to the current session, if an user copy-pastes the URL with the UUID
  storeUuidOnUrl: true
};

// This creates a sandboxed container that allows an independent execution of
// the usage-tracker-multi library. This is useful for apps that
// have more than one usage-tracker-multi, and it prevents leak of the tracker instance
// on the global context
export const createContainer = (containerOpts = {}) => {
  // This allows us to track tracker changes within the sandboxed environment
  let currentTrackerType;
  const DEFAULT_TRACKER_OPTS = {
    // By default we initialise the Public Tracker
    trackerType: 'public',
    // As `events` is a required property from the TrackerConfig we define it here
    // but as a `undefined` value, so once the validation of TrackerConfig is done
    // it will throw an exception for not having the `events` property supplied.
    // as `undefined` will be interpreted as the value not being provided.
    events: undefined,
    // Allows the consumer to monitor/handle when a tracker type is about to change
    // Or simply when `createTracker` is being called
    onBeforeSwitch: () => null
  };
  const {
    history,
    storeUuidOnUrl
  } = defaults(containerOpts || {}, DEFAULT_CONTAINER_OPTS);
  return {
    createTracker: config => {
      const _defaults = defaults(config || {}, DEFAULT_TRACKER_OPTS),
        {
          trackerType,
          onBeforeSwitch
        } = _defaults,
        mergedOptions = _objectWithoutPropertiesLoose(_defaults, _excluded);

      // Retrieves the Multi Tracker object for a given Tracker Type
      const multiTracker = trackerMap[trackerType];

      // If the current tracker type differs from the one we are trying to initialise
      // then we emit the `onBeforeSwitch` even to the consumer, if any was provided
      // By default this will call a stub function and do nothing
      if (currentTrackerType !== trackerType) {
        ensureFn(onBeforeSwitch)({
          from: currentTrackerType,
          to: trackerType
        });
      }

      // This executes custom logic for each Multi Tracker Strategy
      // aka "switching" that allows the next tracker to execute logic
      // either from cleaning up from previous tracker or logic to be exexecuted
      // before we want to initialise the new Tracker
      multiTracker.switch(currentTrackerType, {
        history,
        storeUuidOnUrl
      });

      // Creates the new Usage Tracker instance and store the Tracker Type on the global variable
      const trackerInstance = multiTracker.init(mergedOptions, {
        history,
        storeUuidOnUrl
      });

      // Stores the new Tracker Type on the global variable if the initialisation of the new Tracker succeeded
      currentTrackerType = trackerType;
      return trackerInstance;
    }
  };
};