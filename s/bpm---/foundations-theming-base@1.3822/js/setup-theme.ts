/**
 * Take care importing code here! This is injected into every app as an individual script tag.
 */
import { getHostname, getPathname, getQueryParams } from './utils';

const QA_APP_REGEXP = /(app|local)(-[a-z]+[0-9])?\.hubspotqa\.com/;
const PORTAL_ID_REGEXP = /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/;
const VALID_THEMES = new Set(['trellis-light', 'canvas-light', 'trellis-dark']);
export const DEFAULT_THEME = 'trellis-light';
const COOKIE_THEME_KEY = 'hubspot-theme';
const TRANSITIONAL_DATASET_THEME_KEY = 'hubspotTheme';

/**
 * This is a different key than the one used in the base theme switcher.
 * The base theme switcher uses 'trellis:theme', while this one uses 'hubspot-theme'.
 * This is intentional to avoid conflicts with the base theme switcher, since this
 * key is read by the `setup-theme.ts` file which is used to set _customer_ themes in specific apps,
 * while the `trellis:theme` key is used internally to set the default theme app-wide
 */
export const LOCAL_STORAGE_THEME_KEY = 'hubspot-theme';
export const HUBLESS_LOCAL_STORAGE_THEME_KEY = 'hubspot-theme:hubless';

// Renamed locally for clarity between the two themes
const TRANSITIONAL_LOCAL_STORAGE_THEME_KEY = LOCAL_STORAGE_THEME_KEY;
const TRANSITIONAL_HUBLESS_LOCAL_STORAGE_THEME_KEY =
  HUBLESS_LOCAL_STORAGE_THEME_KEY;
const DEFAULT_TRANSITIONAL_THEME = DEFAULT_THEME;

const VALID_MODERN_THEMES = new Set(['light']);
export const DEFAULT_MODERN_THEME = 'light';
const MODERN_DATASET_THEME_KEY = 'hubspotModernTheme';

/**
 * Modern theme keys are intentionally distinct from the transitional `hubspot-theme`
 * keys above so that the modernized and transitional theme systems can coexist as
 * long as the transitional theme is in use across product. Modern theme names are
 * fully qualified (e.g. `light`, future `dark`) — there is no separate "theme mode" concept.
 */
export const MODERN_LOCAL_STORAGE_THEME_KEY = 'hubspot-modern-theme';
export const MODERN_HUBLESS_LOCAL_STORAGE_THEME_KEY =
  'hubspot-modern-theme:hubless';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function getPortalId() {
  const pathname = getPathname();
  const match = pathname.match(PORTAL_ID_REGEXP);
  return match ? match[1] : null;
}

function getPortalScopedThemeSettings(
  localStorageThemeKey: string
): Record<string, string> {
  try {
    const themeString = localStorage.getItem(localStorageThemeKey);
    if (themeString) {
      return JSON.parse(themeString);
    }
  } catch (e) {
    // do nothing
  }
  return {};
}

function getLocalStorageTheme(): string | null {
  try {
    const portalId = getPortalId();
    if (!portalId) {
      // the hubless theme is just the theme name
      const hublessTheme = localStorage.getItem(
        TRANSITIONAL_HUBLESS_LOCAL_STORAGE_THEME_KEY
      );
      return hublessTheme;
    }
    const themeSettings = getPortalScopedThemeSettings(
      TRANSITIONAL_LOCAL_STORAGE_THEME_KEY
    );
    if (portalId in themeSettings) {
      return themeSettings[portalId];
    }
  } catch (e) {
    // do nothing
  }
  return null;
}

export function getThemeSetting() {
  try {
    // get theme setting from hubspot-theme cookie with higher priority than localStorage
    const themeCookie = getCookie(COOKIE_THEME_KEY);
    const localStorageTheme = getLocalStorageTheme();
    const themeSetting = themeCookie || localStorageTheme;
    if (themeSetting && VALID_THEMES.has(themeSetting)) {
      return themeSetting;
    }
  } catch (e) {
    // do nothing
  }
  return null;
}

function getLocalStorageModernTheme(): string | null {
  try {
    const portalId = getPortalId();
    if (!portalId) {
      const hublessTheme = localStorage.getItem(
        MODERN_HUBLESS_LOCAL_STORAGE_THEME_KEY
      );
      return hublessTheme;
    }
    const themeSettings = getPortalScopedThemeSettings(
      MODERN_LOCAL_STORAGE_THEME_KEY
    );
    if (portalId in themeSettings) {
      return themeSettings[portalId];
    }
  } catch (e) {
    // do nothing
  }
  return null;
}

export function getModernThemeSetting() {
  try {
    const themeSetting = getLocalStorageModernTheme();
    if (themeSetting && VALID_MODERN_THEMES.has(themeSetting)) {
      return themeSetting;
    }
  } catch (e) {
    // do nothing
  }
  return null;
}

const setPortalScopedThemeSetting = (
  localStorageThemeKey: string,
  portalId: string,
  theme: string
) => {
  try {
    const themeSettings = getPortalScopedThemeSettings(localStorageThemeKey);
    localStorage.setItem(
      localStorageThemeKey,
      JSON.stringify({ ...themeSettings, [portalId]: theme })
    );
  } catch {
    // do nothing, let them receive the default theme if we couldn't set it
  }
};

/**
 * In the signup -> setup flow, there is no way to communicate between the hubless and hubful
 * UIs which theme to load initially. We cannot set local storage because the hubful setup app
 * may be on a hubletized domain (-eu1, -ap1), but the hubless signup app is na1-only. As such,
 * when signup redirects to setup, it will pass __initialHubspotTheme which we will use to
 * set the theme in localStorage before we try to read it so that there's an initial theme
 * that will be sticky for future page loads
 */
export function maybeSetInitialTransitionalTheme() {
  const hasThemeSetting = getThemeSetting();
  if (hasThemeSetting) {
    return;
  }

  const queryParams = getQueryParams();
  const initialTheme = queryParams.__initialHubspotTheme;
  const portalId = getPortalId();
  if (portalId && initialTheme && VALID_THEMES.has(initialTheme)) {
    setPortalScopedThemeSetting(
      TRANSITIONAL_LOCAL_STORAGE_THEME_KEY,
      portalId,
      initialTheme
    );
  }
}

// This function will always ensure an initial theme until we have modern theming
// switching in the global nav.
export function setDefaultModernTheme() {
  const hasThemeSetting = getModernThemeSetting();
  if (hasThemeSetting) {
    return;
  }

  const portalId = getPortalId();
  if (!portalId) {
    return;
  }

  setPortalScopedThemeSetting(
    MODERN_LOCAL_STORAGE_THEME_KEY,
    portalId,
    DEFAULT_MODERN_THEME
  );
}

const getBuildTimeTransitionalTheme = () => {
  const theme = (window as any).__FORCE_HUBSPOT_THEME__;

  if (theme && VALID_THEMES.has(theme)) {
    return theme;
  }

  return undefined;
};

const getBuildTimeModernTheme = () => {
  const theme = (window as any).__FORCE_HUBSPOT_MODERN_THEME__;

  if (theme && VALID_MODERN_THEMES.has(theme)) {
    return theme;
  }

  return undefined;
};

export function isHubspotQA() {
  const hostname = getHostname();
  return QA_APP_REGEXP.test(hostname);
}

/**
 * This function is run in the `hubspot-theme` file which is loaded in the <head /> of apps.
 * This is used to synchronize a users theme setting (cookie/local storage) with the data-hubspot-theme
 * `<html />` tag of the app, which is what ThemeProvider uses to derive the theme, and what the CSS
 * uses to select the correct values for the CSS variables. This code runs very early on the page,
 * and is inlined into every app.
 */
const setThemeOnDocument = (key: string, themeSetting: string) => {
  document.documentElement.dataset[key] = themeSetting;
};

const setupTransitionalTheme = () => {
  maybeSetInitialTransitionalTheme();

  const transitionalThemeSetting =
    getBuildTimeTransitionalTheme() ||
    getThemeSetting() ||
    DEFAULT_TRANSITIONAL_THEME;
  setThemeOnDocument(TRANSITIONAL_DATASET_THEME_KEY, transitionalThemeSetting);
};

const setupModernTheme = () => {
  setDefaultModernTheme();

  const modernThemeSetting =
    getBuildTimeModernTheme() ||
    getModernThemeSetting() ||
    DEFAULT_MODERN_THEME;
  setThemeOnDocument(MODERN_DATASET_THEME_KEY, modernThemeSetting);
};

export function setupTheme() {
  try {
    setupTransitionalTheme();
    setupModernTheme();
  } catch {
    // do nothing
  }
}
