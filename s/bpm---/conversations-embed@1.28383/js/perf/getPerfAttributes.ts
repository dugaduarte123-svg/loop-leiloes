import { EXECUTION_MEASUREMENT_PRE_DELAY, EXECUTION_MEASUREMENT_POST_DELAY, START_MARK_PRE_DELAY, END_MARK_PRE_DELAY, START_MARK_POST_DELAY, END_MARK_POST_DELAY } from './constants';
import { buildCmsScriptLoaderSrc } from './util/buildCmsScriptLoaderSrc';
import { buildCmsScriptLoaderPath } from './util/buildCmsScriptLoaderPath';
import { buildNonCmsScriptLoaderPath } from './util/buildNonCmsScriptLoaderPath';
export function getPerfAttributes({
  portalId,
  messagesEnv
}) {
  try {
    const env = messagesEnv === 'qa' ? 'qa' : '';
    const nonCmsSriptLoaderScriptPath = buildNonCmsScriptLoaderPath({
      env,
      portalId
    });
    const cmsScriptLoaderScriptSrc = buildCmsScriptLoaderSrc({
      portalId
    });
    const cmsScriptLoaderScriptPath = buildCmsScriptLoaderPath({
      portalId
    });
    const embedScriptPath = `https://js.usemessages${env}.com/conversations-embed.js`;

    // Get All Entries
    const entries = performance.getEntries().map(({
      name
    }) => name);
    const safeNonCmsScriptLoaderScriptPath = entries.find(value => value.includes(nonCmsSriptLoaderScriptPath)) || nonCmsSriptLoaderScriptPath;
    const safeCmsScriptLoaderScriptPath = entries.find(value => value.includes(cmsScriptLoaderScriptPath)) || cmsScriptLoaderScriptPath;
    const usingCmsScriptLoader = Boolean(document.querySelector(`script[src^="${cmsScriptLoaderScriptSrc}"]`));
    performance.measure(EXECUTION_MEASUREMENT_PRE_DELAY, START_MARK_PRE_DELAY, END_MARK_PRE_DELAY);
    performance.measure(EXECUTION_MEASUREMENT_POST_DELAY, START_MARK_POST_DELAY, END_MARK_POST_DELAY);
    const iframeLoadTimePreDelay = performance.getEntriesByName(EXECUTION_MEASUREMENT_PRE_DELAY)[0];
    const iframeLoadTimePostDelay = performance.getEntriesByName(EXECUTION_MEASUREMENT_POST_DELAY)[0];
    const iframeLoadTimeDuration = iframeLoadTimePreDelay.duration + iframeLoadTimePostDelay.duration;
    const nonCmsScriptLoaderScriptFetchTime = performance.getEntriesByName(safeNonCmsScriptLoaderScriptPath)[0];
    const cmsScriptLoaderScriptFetchTime = performance.getEntriesByName(safeCmsScriptLoaderScriptPath)[0];
    const fetchTimeToUse = usingCmsScriptLoader ? cmsScriptLoaderScriptFetchTime : nonCmsScriptLoaderScriptFetchTime;
    const scriptLoaderFetchTimeDuration = fetchTimeToUse.duration;
    const embedScriptFetchTime = performance.getEntriesByName(embedScriptPath)[0];
    const embedScriptFetchTimeDuration = embedScriptFetchTime.duration;
    if (iframeLoadTimeDuration && scriptLoaderFetchTimeDuration && embedScriptFetchTimeDuration) {
      return {
        iframeLoadTime: iframeLoadTimeDuration,
        scriptLoaderScriptTime: scriptLoaderFetchTimeDuration,
        embedScriptTime: embedScriptFetchTimeDuration
      };
    }
  } catch (error) {
    //
  }
  return null;
}