/* hs-eslint ignored failing-rules */
/* eslint-disable hubspot-dev/no-unsafe-i18n-at-module-eval */

import { I18nInternal as I18n } from '../../internal/i18n-internal';
import localeMapper from './localeMapper';
import spacename from './spacename';
// @ts-ignore `./initializeI18nMethods` in untyped
import { initializeI18nMethods } from './initializeI18nMethods';
initializeI18nMethods(I18n);

// This Set tracks which lang functions we've visited to ensure that we don't visit any
// lang file's function more than once.
let visitedFunctions = new Set();
export function __TEST_ONLY__clearVisitedFunctions() {
  visitedFunctions = new Set();
}
export function createLoader({
  context,
  source,
  mode
}, type = 'visit',
// HACK: I18n.translations is marked as optional, but it is initialized in `initializeI18nMethods`
// and so should always be defined by the time we reach here. We're using the type assertion to work
// around this.
target = I18n) {
  if (!context) {
    throw new Error('invalid provider source');
  }
  const locales = Object.keys(context);
  function applyTranslations(t) {
    // Translation bundles can be null for apps/libs that don't have any keys in their en.lyaml:
    // https://git.hubteam.com/HubSpot/chatspot-ui/blob/master/chatspot-widget-iframe/static/lang/en.lyaml
    if (t !== null) {
      spacename(target.translations, t);
    }
  }
  function visitModule(mod) {
    if (mod) {
      if (type === 'pojo') {
        // In a jest context there is no "default" key for the default export.
        applyTranslations(mod.default || mod);
      }

      // Handle modules that export a visit function
      if (typeof mod.visit === 'function') {
        if (!visitedFunctions.has(mod.visit)) {
          visitedFunctions.add(mod.visit);
          mod.visit(visitModule, applyTranslations);
        }
      }
      if (mod.translations) {
        mod.translations.forEach(applyTranslations);
      }
    }
    return mod;
  }
  function loadContext(locale) {
    // TODO: This check is also done in the default localeMapper.
    // https://git.hubteam.com/HubSpot/I18n/blob/master/static/js/init/internal/localeMapper.ts
    // I'm guessing it's also here in case a different mapper is passed? We should see whether we can
    // dedupe it, as failing that check will simply cause the `load` to no-op.
    if (locales.indexOf(locale) < 0) {
      throw new Error(`locale ${locale} does not exist for ${source}`);
    }
    return context[locale]();
  }
  function loadSync(locale) {
    if (mode !== 'sync') {
      throw new Error(`${source} is not sync`);
    }
    return visitModule(loadContext(locale));
  }
  function loadLazy(locale) {
    if (mode !== 'lazy') {
      throw new Error(`${source} is not lazy`);
    }
    return loadContext(locale).then(visitModule).catch(error => {
      target.hasHadLoadingFailure = true;
      setTimeout(() => {
        throw error;
      }, 0);
    });
  }
  function load(allLocales, options = {}) {
    const loadLocalePromises = [];
    const map = options.localeMapper || localeMapper;
    const alreadyLoadedLocales = {};

    // TODO: This would be cleaner as a for loop
    allLocales.forEach(locale => {
      const localeToLoad = map(locale, locales);

      // TODO: We can just pass locales through a Set to dedupe them
      const hasLoadedLocale = localeToLoad ? alreadyLoadedLocales[localeToLoad] : undefined;
      if (!hasLoadedLocale && localeToLoad && mode === 'lazy') {
        loadLocalePromises.push(loadLazy(localeToLoad));
        alreadyLoadedLocales[localeToLoad] = true;
      } else if (!hasLoadedLocale && localeToLoad) {
        loadLocalePromises.push(Promise.resolve(loadSync(localeToLoad)));
        alreadyLoadedLocales[localeToLoad] = true;
      }
    });

    // TODO: We should either consistently return an array or nothing.
    // Note that since we directly return the result of this promise.all to the caller of provider.register,
    // our public api is currently:
    //   resolve to (module | undefined)[] on partial success (failures are undefined)
    //   resolve to number on failure
    // We have consumers relying on this behavior (and there's currently no other way to tell success vs
    // failure), so I've added tests to ensure it doesn't change.
    // See https://git.hubteam.com/HubSpot/crm-sdk/blob/master/crm-cards/static/js/internal/CardTranslationsLoader.tsx#L194-L196
    return Promise.all(loadLocalePromises).catch(error => setTimeout(() => {
      throw error;
    }, 0));
  }
  return {
    mode,
    load,
    locales,
    loadSync,
    loadLazy,
    visitModule
  };
}
export function create() {
  let setLocale = __locales => {
    throw new Error('`setLocale()` called early');
  };
  const intl = {
    langRegistry: {},
    localePromise: new Promise(resolve => setLocale = resolve),
    setLocale,
    register(lang, loadOptions = {}) {
      if (this.langRegistry[lang.source]) {
        return Promise.resolve();
      }
      this.langRegistry[lang.source] = lang;
      const provider = createLoader(lang, loadOptions.type);
      if (process.env.NODE_ENV === 'development' && module.hot) {
        window.addEventListener(`i18n_reload_${lang.source}`, event => {
          const customEvent = event;
          provider.visitModule(customEvent.detail.module);
          window.dispatchEvent(new Event('i18n_reload_complete'));
        });
      }
      return this.localePromise.then(allLocales => provider.load(loadOptions.getLocales ? loadOptions.getLocales(allLocales) : allLocales, loadOptions)).catch(error => setTimeout(() => {
        throw error;
      }, 0));
    }
  };
  return intl;
}