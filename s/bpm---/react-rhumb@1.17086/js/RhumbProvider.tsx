import { Component, memo, useMemo, useReducer, useRef, useEffect, useState } from 'react';
import Raven from 'raven-js';
import { captureException } from './internal/ravenUtils';
import invariant from 'react-utils/invariant';
import memoizeOne from 'react-utils/memoizeOne';
import usePrevious from 'react-utils/hooks/usePrevious';
import enviro from 'enviro';
import memoizeStringOnly from './vendor/memoizeStringOnly';
import RhumbContext, { flushMarkerQueue } from './internal/RhumbContext';
import * as Constants from './internal/Constants';
import matchRoute from './internal/matchRoute';
import { runWithLowPriority } from './internal/Scheduler';
import performanceNow from './vendor/performanceNow';
import ReaganCompatReporter from './internal/reporters/ReaganCompatReporter';
import InAppReporter from './internal/reporters/InAppReporter';
import UnexpectedRouteReporter from './internal/reporters/UnexpectedRouteReporter';
import GlobalErrorReporter from './internal/reporters/GlobalErrorReporter';
import VitalsReporter from './internal/reporters/VitalsReporter';
import WebVitalsAdapter, { isWebVitalsAdapterEnabled } from './internal/reporters/WebVitalsAdapter';
import DOMEventReporter from './internal/reporters/DOMEventReporter';
import MemoryReporter from './internal/reporters/MemoryReporter';
import PageLoadHTTPReporter from './internal/reporters/PageLoadHTTPReporter';
import PerformanceReporter from './internal/reporters/PerformanceReporter';
import GraniteHealthReporter from './internal/reporters/GraniteHealthReporter';
import emptyFunction from 'react-utils/emptyFunction';
import { pushAppUnload, pushNewTabOpening, pushNewTabOpened } from './internal/appTransitionHistory';
import { isInIframe } from './internal/browserAccessors';
import { getStaticAppName, getStaticAppVersion } from './internal/staticAppInfo';
import RhumbGlobalErrorBoundary from './internal/RhumbGlobalErrorBoundary';
import { PageLoadMetrics } from './internal/Metrics';
import PageReloadReporter from './internal/reporters/PageReloadReporter';
import VisibleMarkersReporter from './internal/reporters/VisibleMarkersReporter';
import RegressionTracker from './RegressionTracker';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
function useInitial(initialValue) {
  const ref = useRef(undefined);
  if (!ref.current) {
    ref.current = {
      value: initialValue()
    };
  }
  return ref.current.value;
}
const buildRouteSpecs = partialRouteSpecs => {
  if (process.env.NODE_ENV !== 'production') {
    invariant(partialRouteSpecs, 'routeSpecs cannot be null');
  }
  return Object.keys(partialRouteSpecs).reduce((acc, route) => {
    const routeSpec = partialRouteSpecs[route];
    const {
      success = {
        default: []
      },
      partialSuccess = {},
      error = [],
      globalNav = 'default'
    } = routeSpec;
    acc[route] = {
      route,
      globalNav,
      success,
      partialSuccess,
      error: [...error, ...Constants.INTERNAL_ERROR_MARKERS]
    };
    return acc;
  }, {});
};
const buildGetRouteSpec = routeSpecs => {
  const routeKeys = Object.keys(routeSpecs);
  const routeMatcher = matchRoute(routeKeys);
  return memoizeStringOnly(pathname => {
    const route = routeKeys.find(key => routeMatcher(key, pathname));
    return routeSpecs[route];
  });
};
const buildCheckStatus = getRouteSpec => {
  const checkStatusImpl = ({
    pathname,
    checks,
    expiredTimestamp
  }) => {
    const routeSpec = getRouteSpec(pathname);
    // TODO DOCUMENT success wins all ties

    if (expiredTimestamp) {
      return {
        type: 'TIMEOUT'
      };
    } else if (!routeSpec) {
      return {
        type: 'PENDING'
      };
    } else {
      const isMounted = marker => checks[marker];
      const successScenarios = Object.keys(routeSpec.success).filter(scenario => routeSpec.success[scenario].length && routeSpec.success[scenario].every(isMounted));
      if (successScenarios.length) {
        // TODO warn if multiple
        return {
          type: 'SUCCESS',
          scenario: successScenarios[0]
        };
      } else if (routeSpec.partialSuccess) {
        const partialSuccessScenarios = Object.keys(routeSpec.partialSuccess).filter(scenario => routeSpec.partialSuccess[scenario].length && routeSpec.partialSuccess[scenario].every(isMounted));
        if (partialSuccessScenarios.length) {
          // TODO warn if multiple
          return {
            type: 'PARTIAL_SUCCESS',
            scenario: partialSuccessScenarios[0]
          };
        }
      }
      if (routeSpec.error.some(isMounted)) {
        return {
          type: 'FAILURE'
        };
      }
    }
    return {
      type: 'PENDING'
    };
  };
  return memoizeOne(checkStatusImpl);
};
const buildReporter = (getRouteSpec, report) => {
  return (type, entry, extra) => {
    const {
      pathname
    } = entry;
    const routeSpec = getRouteSpec(pathname);
    const payload = {
      entry,
      routeSpec
    };
    if (extra) {
      Object.assign(payload, {
        extra
      });
    }
    report({
      type,
      payload
    });
  };
};
const reducer = (prevState, action) => {
  const {
    entry: prevEntry,
    entry: {
      pathname: prevPathname,
      id: prevId,
      checks: prevChecks
    },
    entries: prevEntries,
    visibleMarkerRefs: prevVisibleMarkerRefs
  } = prevState;
  switch (action.type) {
    case 'HISTORY_CHANGED':
      {
        const {
          pathname,
          timestamp
        } = action.payload;
        return pathname !== prevPathname ? Object.assign({}, prevState, {
          entry: {
            id: prevId + 1,
            pathname,
            referrer: prevPathname,
            timestamp,
            checks: {},
            expiredTimestamp: null,
            dirty: false
          },
          entries: [...prevEntries, prevEntry]
        }) : prevState;
      }
    case 'MARKER_MOUNTED':
      {
        const {
          marker: {
            name: marker,
            id
          },
          timestamp
        } = action.payload;
        if (process.env.NODE_ENV !== 'production') {
          if (prevChecks[marker]) {
            console.error('[react-rhumb] marker already rendered: "%s". Rendering duplicate markers is deprecated and route failure in the next version', marker);
          }
        }
        return prevId === id ? Object.assign({}, prevState, {
          entry: Object.assign({}, prevEntry, {
            dirty: true,
            checks: Object.assign({}, prevChecks, {
              [marker]: {
                timestamp
              }
            })
          })
        }) : prevState;
      }
    case 'MARKER_UNMOUNTED':
      {
        const {
          marker: {
            name: marker,
            id
          }
        } = action.payload;
        if (prevId === id && prevChecks[marker]) {
          const checks = Object.assign({}, prevChecks);
          delete checks[marker];
          return Object.assign({}, prevState, {
            entry: Object.assign({}, prevEntry, {
              checks
            })
          });
        }
        return prevState;
      }
    case 'TIMEDOUT':
      {
        const {
          timestamp
        } = action.payload;
        return Object.assign({}, prevState, {
          entry: Object.assign({}, prevEntry, {
            expiredTimestamp: timestamp
          })
        });
      }
    case 'ADD_MARKER_REF':
      {
        const {
          marker: {
            name: marker,
            id
          },
          ref
        } = action.payload;
        if (prevId === id) {
          return Object.assign({}, prevState, {
            visibleMarkerRefs: Object.assign({}, prevVisibleMarkerRefs, {
              [marker]: ref
            })
          });
        }
        return prevState;
      }
    default:
      {
        return prevState;
      }
  }
};
const usePreventPropChange = process.env.NODE_ENV !== 'production' ? props => {
  const {
    config,
    history,
    timingOffset,
    staticAppInfo
  } = props;
  const configRef = useRef(config);
  const historyRef = useRef(history);
  const timingOffsetRef = useRef(timingOffset);
  const staticAppInfoRef = useRef(staticAppInfo);
  useEffect(() => {
    invariant(configRef.current === config, '`config` should not change');
    invariant(historyRef.current === history, '`history` should not change');
    invariant(timingOffsetRef.current === timingOffset, '`timingOffset` should not change');
    invariant(staticAppInfoRef.current === staticAppInfo, '`staticAppInfo` should not change');
    configRef.current = config;
    historyRef.current = history;
    timingOffsetRef.current = timingOffset;
    staticAppInfoRef.current = staticAppInfo;
  }, [config, history, timingOffset, staticAppInfo]);
} : () => {};
const useHistoryEffect = (history, callback) => {
  const queue = useRef([]);
  const flush = useRef(emptyFunction);
  const savedCallback = useRef(emptyFunction);
  useEffect(() => {
    savedCallback.current = callback;
  });
  if (flush.current === emptyFunction) {
    const unlisten = history.listen(({
      pathname
    }) => {
      const timestamp = performanceNow();
      queue.current.push({
        pathname,
        timestamp
      });
    });
    flush.current = () => {
      unlisten();
      queue.current.forEach(entry => savedCallback.current(entry));
      queue.current = [];
      flush.current = () => {};
    };
  }
  useEffect(() => {
    flush.current();
    return history.listen(savedCallback.current);
  }, [history]);
};
const useRouteTracking = (history, getRouteSpec) => {
  const {
    pathname
  } = history;
  const initialRouteSpec = useInitial(() => getRouteSpec(pathname));
  const updateRouteData = routeSpec => {
    const route = routeSpec ? routeSpec.route : 'unknown-route';
    Raven.setExtraContext({
      route
    });
  };
  useEffect(() => {
    updateRouteData(initialRouteSpec);
  }, [initialRouteSpec]);
  const handleHistoryChange = ({
    pathname: nextPathname
  }) => {
    updateRouteData(getRouteSpec(nextPathname));
  };
  useHistoryEffect(history, handleHistoryChange);
};
const useHasSomeVisibleMarker = () => {
  const [hasSomeVisibleMarker, setHasSomeVisibleMarker] = useState(null);
  const prevHasSomeVisibleMarker = useRef(null);
  const observer = useMemo(() => new IntersectionObserver(entries => {
    // we should report if one or more markers are visible to account for flakiness
    setHasSomeVisibleMarker(entries.some(entry => entry.isIntersecting));
  }), []);
  useEffect(() => {
    prevHasSomeVisibleMarker.current = hasSomeVisibleMarker;
  }, [hasSomeVisibleMarker]);
  useEffect(() => () => observer.disconnect(), [observer]);
  return {
    observer,
    hasSomeVisibleMarker,
    prevHasSomeVisibleMarker: prevHasSomeVisibleMarker.current
  };
};
const RhumbProvider = props => {
  usePreventPropChange(props);
  const {
    ErrorComponent,
    history,
    history: {
      pathname: historyPathname
    },
    config,
    children,
    timingOffset,
    staticAppInfo,
    userId,
    softNavigationContext,
    isGraniteEnabled,
    isGraniteRemoteApp,
    graniteHealthThresholds,
    captureExceptions = true,
    trackVisibility: trackVisibilityDefaultValue
  } = props;
  const isInNavMarkerVisibilityTestMode = enviro.debug('react-rhumb-visibility') === 'true';
  const [trackVisibility, setTrackVisibility] = useState(trackVisibilityDefaultValue);
  const [autoToggleTrackVisibility, setAutoToggleTrackVisibility] = useState(false);
  useEffect(() => {
    if (autoToggleTrackVisibility && isInNavMarkerVisibilityTestMode) {
      const intervalId = setInterval(() => {
        setTrackVisibility(currentValue => !currentValue);
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [autoToggleTrackVisibility, isInNavMarkerVisibilityTestMode]);
  const routeSpecs = useMemo(() => buildRouteSpecs(config), [config]);
  const initialState = useMemo(() => ({
    entry: {
      id: 0,
      pathname: historyPathname,
      referrer: undefined,
      timestamp: 0,
      checks: {},
      expiredTimestamp: null,
      dirty: false
    },
    entries: [],
    visibleMarkerRefs: {}
  }), [historyPathname]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const markerQueue = useInitial(() => []);
  const getRouteSpec = useMemo(() => buildGetRouteSpec(routeSpecs), [routeSpecs]);
  useRouteTracking(history, getRouteSpec);
  const handleHistoryChange = ({
    timestamp,
    pathname: nextPathname
  }) => {
    runWithLowPriority(() => {
      dispatch({
        type: 'HISTORY_CHANGED',
        payload: {
          pathname: nextPathname,
          timestamp
        }
      });
    });
  };
  useHistoryEffect(history, handleHistoryChange);
  const reportersRef = useRef([]);
  const reportAction = useInitial(() => {
    const consoleReporterModule = process.env.NODE_ENV === 'production' ? require('./internal/reporters/ProdConsoleReporter') : require('./internal/reporters/DevConsoleReporter');
    const ConsoleReporter = consoleReporterModule.default ? consoleReporterModule.default : consoleReporterModule;
    const reporters = [new ConsoleReporter({
      timingOffset,
      softNavigationContext
    }), new ReaganCompatReporter({
      timingOffset,
      staticAppInfo,
      userId,
      softNavigationContext,
      isGraniteEnabled,
      isGraniteRemoteApp
    }), new InAppReporter({
      staticAppInfo,
      userId,
      softNavigationContext,
      isGraniteEnabled,
      isGraniteRemoteApp
    }), new UnexpectedRouteReporter(), new GlobalErrorReporter(), VitalsReporter.getInstance({
      staticAppInfo,
      userId
    }), ...(isWebVitalsAdapterEnabled() ? [WebVitalsAdapter.getInstance({
      staticAppInfo,
      userId
    })] : []), new DOMEventReporter(), new MemoryReporter({
      staticAppInfo,
      userId
    }), new PageReloadReporter(), new VisibleMarkersReporter(), new PageLoadHTTPReporter(), new PerformanceReporter(), new GraniteHealthReporter({
      staticAppInfo,
      userId,
      softNavigationContext,
      thresholds: graniteHealthThresholds
    })];
    reportersRef.current = reporters;
    return action => reporters.forEach(r => {
      try {
        r.report(action);
      } catch (e) {
        captureException(e instanceof Error ? e : new Error(String(e)));
      }
    });
  });
  useEffect(() => {
    reportersRef.current.forEach(reporter => {
      if (typeof reporter.updateUserId === 'function') {
        reporter.updateUserId(userId !== null && userId !== void 0 ? userId : null);
      }
    });
  }, [userId]);
  useEffect(() => {
    if (enviro.deployed()) {
      return undefined;
    }
    window.flushRhumb = () => {
      reportersRef.current.forEach(reporter => {
        if (typeof reporter.flushAllQueues === 'function') {
          reporter.flushAllQueues();
        }
      });
    };
    return () => {
      delete window.flushRhumb;
    };
  }, []);
  const report = useMemo(() => {
    return buildReporter(getRouteSpec, reportAction);
  }, [getRouteSpec, reportAction]);
  const reportError = (error, extra) => {
    report('GLOBAL_ERROR', state.entry, Object.assign({
      error
    }, extra));
  };
  const checkStatus = useMemo(() => buildCheckStatus(getRouteSpec), [getRouteSpec]);
  const timeoutRef = useRef(undefined);
  const prevState = usePrevious(state);
  const {
    observer,
    hasSomeVisibleMarker,
    prevHasSomeVisibleMarker
  } = useHasSomeVisibleMarker();
  useEffect(() => {
    const handleTimeout = () => {
      const timestamp = performanceNow();
      flushMarkerQueue(markerQueue, dispatch);
      runWithLowPriority(() => {
        dispatch({
          type: 'TIMEDOUT',
          payload: {
            timestamp
          }
        });
      });
    };
    const reportForStatus = (status, entry) => {
      switch (status.type) {
        case 'SUCCESS':
          {
            const {
              scenario
            } = status;
            report('ROUTE_SUCCEEDED', entry, {
              scenario
            });
            break;
          }
        case 'PARTIAL_SUCCESS':
          {
            const {
              scenario
            } = status;
            report('ROUTE_PARTIAL_SUCCESS', entry, {
              scenario
            });
            break;
          }
        case 'TIMEOUT':
          report('ROUTE_TIMEOUT_EXPIRED', entry);
          break;
        case 'FAILURE':
          report('ROUTE_FAILED', entry);
          break;
        default:
          throw new Error(`unexpected status type ${status.type}`);
      }
    };

    // there are new history entries
    if (prevState && state.entries !== prevState.entries) {
      const {
        entry: prevEntry,
        entry: {
          checks: prevChecks
        },
        entries: prevEntries
      } = prevState;
      const {
        entries: currentEntries
      } = state;

      // clear the timeout
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;

      //run through special cases
      const [trailingEntry, ...skippedEntries] = currentEntries.slice(prevEntries.length - currentEntries.length);
      const {
        pathname: trailingPathname,
        checks: trailingChecks
      } = trailingEntry;
      const trailingRouteSpec = getRouteSpec(trailingPathname);
      if (trailingRouteSpec) {
        if (trailingChecks !== prevChecks) {
          report('CHECKS_CHANGED', trailingEntry);
        }
        const status = checkStatus(trailingEntry);
        if (trailingEntry !== prevEntry) {
          // the previous entry changed during the last batch of updates and should be checked
          if (status.type !== 'PENDING') {
            reportForStatus(status, trailingEntry);
          } else {
            report('ROUTE_ABANDONED', trailingEntry);
          }
        } else {
          if (status.type === 'PENDING') {
            report('ROUTE_ABANDONED', trailingEntry);
          }
        }
      }

      // entries that were added between updates
      // nothing should ever have been mounted in these entries
      skippedEntries.forEach(skippedEntry => {
        const {
          pathname: skippedPathname
        } = skippedEntry;
        const skippedRouteSpec = getRouteSpec(skippedPathname);
        if (skippedRouteSpec) {
          report('ROUTE_STARTED', skippedEntry);
          report('ROUTE_ABANDONED', skippedEntry);
        } else {
          report('ROUTE_UNEXPECTED', skippedEntry);
        }
      });
    }

    // check the new entry
    if (!prevState || prevState.entries !== state.entries) {
      const {
        entry: currentEntry,
        entry: {
          pathname: currentPathname,
          dirty: currentDirty
        }
      } = state;
      const routeSpec = getRouteSpec(currentPathname);
      if (routeSpec) {
        report('ROUTE_STARTED', currentEntry);
        if (currentDirty) {
          // TODO can this ever be hit?
          report('CHECKS_CHANGED', currentEntry);
        }
        const status = checkStatus(currentEntry);
        if (status.type !== 'PENDING') {
          // TODO can this ever be hit?
          reportForStatus(status, currentEntry);
        } else {
          timeoutRef.current = setTimeout(handleTimeout, Constants.DEFAULT_TIMEOUT);
        }
      } else {
        report('ROUTE_UNEXPECTED', currentEntry);
      }
    }

    // there are no new history entries but existing entry has some changes and needs to be checked
    if (prevState && prevState.entries === state.entries && prevState.entry !== state.entry) {
      const {
        entry: {
          checks: prevChecks
        }
      } = prevState;
      const {
        entry: currentEntry,
        entry: {
          checks: currentChecks,
          pathname: currentPathname
        }
      } = state;
      const routeSpec = getRouteSpec(currentPathname);
      if (routeSpec) {
        if (currentChecks !== prevChecks) {
          report('CHECKS_CHANGED', currentEntry);
        }
        const status = checkStatus(currentEntry);
        if (status.type !== 'PENDING') {
          reportForStatus(status, currentEntry);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = undefined;
        }
      }
    }
    if (prevState && prevState.visibleMarkerRefs !== state.visibleMarkerRefs && trackVisibility) {
      const {
        entry: currentEntry,
        entry: {
          pathname: currentPathname
        }
      } = state;
      const routeSpec = getRouteSpec(currentPathname);
      if (routeSpec) {
        // check that all markers have associated visibility
        const allVisibleMarkersDefined = Object.keys(state.entry.checks).every(marker => Object.prototype.hasOwnProperty.call(state.visibleMarkerRefs, marker) && !!state.visibleMarkerRefs[marker] && state.visibleMarkerRefs[marker].current !== null);
        const status = checkStatus(currentEntry);
        if (status.type === 'SUCCESS' && allVisibleMarkersDefined) {
          Object.values(state.visibleMarkerRefs).forEach(ref => !!ref.current && observer.observe(ref.current));
        }
      }
    }
  }, [prevState, state, getRouteSpec, checkStatus, report, observer, trackVisibility, markerQueue]);
  useEffect(() => {
    if (prevHasSomeVisibleMarker === null && hasSomeVisibleMarker !== prevHasSomeVisibleMarker && trackVisibility) {
      const {
        entry: currentEntry
      } = state;
      const status = checkStatus(currentEntry);
      const {
        scenario
      } = status;
      if (!hasSomeVisibleMarker) {
        // report no visible markers to MaaS
        report('NO_VISIBLE_MARKERS', currentEntry, {
          scenario
        });
      }
    }
  }, [hasSomeVisibleMarker, prevHasSomeVisibleMarker, state, checkStatus, report, trackVisibility]);
  useEffect(() => {
    PageLoadMetrics.timer('rhumb-provider-mounted').update(performanceNow());
    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      reportersRef.current.forEach(reporter => reporter.destroy());
    };
  }, []);

  // Track app unload for transition detection.
  // Note on timing: For normal link click navigation (our primary use case), beforeunload
  // fires synchronously and the browser waits for the handler to complete before navigating.
  // This ensures the sessionStorage write completes reliably. Browsers may skip beforeunload
  // in edge cases (bfcache restoration, browser crashes, mobile tab kills), but those scenarios
  // don't have a document.referrer from our app anyway, so transition detection correctly
  // returns null.
  useEffect(() => {
    const handleBeforeUnload = () => {
      const appName = getStaticAppName(staticAppInfo);
      const appVersion = getStaticAppVersion(staticAppInfo);

      // Only push unload event if we have an app name
      if (appName) {
        pushAppUnload(appName, appVersion, window.location.href);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [staticAppInfo]);

  // Track when new tabs are opened so we don't count them as transitions.
  // When a new tab is opened via target="_blank" or window.open(), the new tab
  // inherits sessionStorage. We push NEW_TAB_OPENING before the tab is created,
  // then NEW_TAB_OPENED after. The new tab only gets the OPENING event, so it
  // knows it wasn't a same-tab transition.
  useEffect(() => {
    const handleClick = event => {
      const target = event.target;
      const link = target instanceof Element ? target.closest('a') : null;
      if ((link === null || link === void 0 ? void 0 : link.target) === '_blank') {
        pushNewTabOpening();
        setTimeout(pushNewTabOpened, 0);
      }
    };
    let originalWindowOpen = null;
    if (!isInIframe()) {
      try {
        originalWindowOpen = window.open.bind(window);
        window.open = (...args) => {
          pushNewTabOpening();
          setTimeout(pushNewTabOpened, 0);
          return originalWindowOpen(...args);
        };
      } catch (_unused) {
        originalWindowOpen = null;
      }
      document.addEventListener('click', handleClick, true);
    }
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (originalWindowOpen) {
        try {
          window.open = originalWindowOpen;
        } catch (_unused2) {
          // window.open is read-only; cleanup not possible
        }
      }
    };
  }, []);
  const {
    entry: {
      checks: currentChecks,
      id: currentId
    }
  } = state;
  const visibleMarkers = useMemo(() => Object.keys(currentChecks).filter(marker => currentChecks[marker]), [currentChecks]);
  const contextValue = useMemo(() => ({
    id: currentId,
    dispatch,
    reportAction,
    trackVisibility,
    markerQueue
  }), [currentId, reportAction, trackVisibility, markerQueue]);
  const visibleMarkersData = useMemo(() => visibleMarkers.map(encodeURIComponent).join(','), [visibleMarkers]);
  return /*#__PURE__*/_jsxs(RhumbContext.Provider, {
    value: contextValue,
    children: [captureExceptions ? /*#__PURE__*/_jsx(RhumbGlobalErrorBoundary, {
      onError: reportError,
      ErrorComponent: ErrorComponent,
      children: children || null
    }) : children || null, /*#__PURE__*/_jsx("div", {
      hidden: true,
      "aria-hidden": "true",
      "data-id-markers": visibleMarkersData,
      children: visibleMarkers.map(marker => /*#__PURE__*/_jsx("mark", {
        "data-id-marker": marker
      }, marker))
    }), isInNavMarkerVisibilityTestMode && /*#__PURE__*/_jsx(RegressionTracker, {
      isTrackingVisibility: !!trackVisibility,
      isAutoToggling: autoToggleTrackVisibility,
      toggleTrackVisibility: e => {
        setTrackVisibility(e.target.checked);
      },
      setAutoToggle: e => {
        setAutoToggleTrackVisibility(e.target.checked);
      }
    })]
  });
};
const MemoizedRhumbProvider = /*#__PURE__*/memo(RhumbProvider);
const RhumbProviderMountSignal = ({
  onMount
}) => {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return null;
};
class RhumbProviderFallbackBoundary extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hasError: false,
      error: null
    };
    this.rhumbProviderMounted = false;
    this.handleMount = () => {
      this.rhumbProviderMounted = true;
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error) {
    captureException(error instanceof Error ? error : new Error(String(error)));
  }
  render() {
    if (this.state.hasError) {
      var _this$props$children;
      if (this.rhumbProviderMounted) {
        throw this.state.error;
      }
      return (_this$props$children = this.props.children) !== null && _this$props$children !== void 0 ? _this$props$children : null;
    }
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(RhumbProviderMountSignal, {
        onMount: this.handleMount
      }), /*#__PURE__*/_jsx(MemoizedRhumbProvider, Object.assign({}, this.props))]
    });
  }
}
function RhumbProviderWithFallback(props) {
  if (props.captureExceptions === false) {
    return /*#__PURE__*/_jsx(MemoizedRhumbProvider, Object.assign({}, props));
  }
  return /*#__PURE__*/_jsx(RhumbProviderFallbackBoundary, Object.assign({}, props));
}
export default RhumbProviderWithFallback;