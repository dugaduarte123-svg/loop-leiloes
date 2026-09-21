'use es6';

/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    getNavigationEntry
} from '../lib/getNavigationEntry.js';
import {
    getSelector
} from '../lib/getSelector.js';
import {
    initUnique
} from '../lib/initUnique.js';
import {
    LCPEntryManager
} from '../lib/LCPEntryManager.js';
import {
    checkSoftNavsEnabled
} from '../lib/softNavs.js';
import {
    onLCP as unattributedOnLCP
} from '../onLCP.js';
/**
 * Calculates the [LCP](https://web.dev/articles/lcp) value for the current page and
 * calls the `callback` function once the value is ready (along with the
 * relevant `largest-contentful-paint` performance entry used to determine the
 * value). The reported value is a `DOMHighResTimeStamp`.
 *
 * If the `reportAllChanges` configuration option is set to `true`, the
 * `callback` function will be called any time a new `largest-contentful-paint`
 * performance entry is dispatched, or once the final value of the metric has
 * been determined.
 */
export const onLCP = (onReport, opts = {}) => {
    // Clone the opts object to ensure it's unique, so we can initialize a
    // single instance of the `LCPEntryManager` class that's shared only with
    // this function invocation and the `unattributedOnLCP()` invocation below
    // (which is passed the same `opts` object).
    opts = Object.assign({}, opts);
    const lcpEntryManager = initUnique(opts, LCPEntryManager);
    const lcpTargetMap = new WeakMap();
    if (checkSoftNavsEnabled(opts)) {
        lcpEntryManager._softNavigationEntryMap = new Map();
    }
    lcpEntryManager._onBeforeProcessingEntry = entry => {
        const node = entry.element;
        if (node) {
            var _opts$generateTarget, _opts$generateTarget2, _opts;
            const customTarget = (_opts$generateTarget = (_opts$generateTarget2 = (_opts = opts).generateTarget) === null || _opts$generateTarget2 === void 0 ? void 0 : _opts$generateTarget2.call(_opts, node)) !== null && _opts$generateTarget !== void 0 ? _opts$generateTarget : getSelector(node);
            lcpTargetMap.set(entry, customTarget);
        } else if (entry.id) {
            // Use the LargestContentfulPaint.id property when the element has been
            // removed from the DOM (and so node is null), but still has an ID.
            lcpTargetMap.set(entry, `#${entry.id}`);
        }
    };
    const attributeLCP = metric => {
        // Use a default object if no other attribution has been set.
        let attribution = {
            timeToFirstByte: 0,
            resourceLoadDelay: 0,
            resourceLoadDuration: 0,
            elementRenderDelay: metric.value
        };
        if (metric.entries.length) {
            // The `metric.entries.length` check ensures there will be an entry.
            const lcpEntry = metric.entries.at(-1);
            const lcpResourceEntry = lcpEntry.url && performance.getEntriesByType('resource').find(e => e.name === lcpEntry.url);
            attribution.target = lcpTargetMap.get(lcpEntry);
            attribution.lcpEntry = lcpEntry;
            // Only attribute the URL and resource entry if they exist.
            if (lcpEntry.url) {
                attribution.url = lcpEntry.url;
            }
            if (lcpResourceEntry) {
                attribution.lcpResourceEntry = lcpResourceEntry;
            }
            // Get subparts from navigation entry. Do this last as occasionally
            // Safari seems to fail to find a navigation entry.
            let navigationEntry;
            let activationStart = 0;
            let responseStart = 0;
            if (metric.navigationType !== 'soft-navigation') {
                var _navigationEntry$acti, _navigationEntry, _navigationEntry$resp, _navigationEntry2;
                navigationEntry = getNavigationEntry();
                activationStart = (_navigationEntry$acti = (_navigationEntry = navigationEntry) === null || _navigationEntry === void 0 ? void 0 : _navigationEntry.activationStart) !== null && _navigationEntry$acti !== void 0 ? _navigationEntry$acti : 0;
                responseStart = (_navigationEntry$resp = (_navigationEntry2 = navigationEntry) === null || _navigationEntry2 === void 0 ? void 0 : _navigationEntry2.responseStart) !== null && _navigationEntry$resp !== void 0 ? _navigationEntry$resp : 0;
            } else {
                var _lcpEntryManager$_sof;
                // Set activationStart to the navigation start time
                activationStart = metric.navigationStartTime || 0;
                // Lookup the soft navigation entry. Do not use getEntriesByType since
                // that is limited to the first 50 navigation entries due to buffer
                // size.
                navigationEntry = (_lcpEntryManager$_sof = lcpEntryManager._softNavigationEntryMap) === null || _lcpEntryManager$_sof === void 0 ? void 0 : _lcpEntryManager$_sof.get(metric.navigationId);
            }
            if (navigationEntry) {
                const ttfb = Math.max(0, responseStart - activationStart);
                const lcpRequestStart = Math.max(ttfb,
                    // Prefer `requestStart` (if TOA is set), otherwise use `startTime`.
                    lcpResourceEntry ? (lcpResourceEntry.requestStart || lcpResourceEntry.startTime) - activationStart : 0);
                const lcpResponseEnd = Math.min(
                    // Cap at LCP time (videos continue downloading after LCP for example)
                    metric.value, Math.max(lcpRequestStart, lcpResourceEntry ? lcpResourceEntry.responseEnd - activationStart : 0));
                attribution = Object.assign({}, attribution, {
                    timeToFirstByte: ttfb,
                    resourceLoadDelay: lcpRequestStart - ttfb,
                    resourceLoadDuration: lcpResponseEnd - lcpRequestStart,
                    elementRenderDelay: metric.value - lcpResponseEnd,
                    navigationEntry
                });
            }
        }
        // Use `Object.assign()` to ensure the original metric object is returned.
        return Object.assign(metric, {
            attribution
        });
    };
    unattributedOnLCP(metric => {
        onReport(attributeLCP(metric));
    }, opts);
};