"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeployInfo = getDeployInfo;
const DEPLOYABLE_SERVER_TIMING_ENTRY_NAME = 'd';
function getDeployInfo(perf = window.performance) {
  try {
    var _serverTimingEntries$;
    const firstNavigationEntry = perf.getEntriesByType('navigation')[0];
    const serverTimingEntries = firstNavigationEntry.serverTiming;
    const description = (_serverTimingEntries$ = serverTimingEntries.find(entry => entry.name === DEPLOYABLE_SERVER_TIMING_ENTRY_NAME)) === null || _serverTimingEntries$ === void 0 ? void 0 : _serverTimingEntries$.description;
    if (!description) return undefined;
    const [deployable, deployId] = description.split('#');
    if (deployable !== undefined && deployId !== undefined) {
      return {
        deployable,
        deployId
      };
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
}