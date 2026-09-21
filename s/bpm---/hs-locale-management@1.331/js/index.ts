const HS_LOCALE_KEY = 'hs_locale';
const HS_LOCALE_HEADER = 'X-HS-Locale';
const getLocalStorage = () => {
  try {
    return window.localStorage;
  } catch (_error) {
    return undefined;
  }
};
export const getHsLocale = () => {
  try {
    const storage = getLocalStorage();
    return storage ? storage.getItem(HS_LOCALE_KEY) : null;
  } catch (_e) {
    return null;
  }
};
export const setHsLocale = locale => {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(HS_LOCALE_KEY, locale);
  } catch (_e) {
    try {
      storage.removeItem(HS_LOCALE_KEY);
    } catch (_error) {
      // If we fail to remove, do nothing
    }
  }
};
export const clearHsLocale = () => {
  try {
    const storage = getLocalStorage();
    if (storage) {
      storage.removeItem(HS_LOCALE_KEY);
    }
  } catch (_e) {
    // If we fail to remove, do nothing
  }
};
export const persistHsLocaleFromUserInfo = (hsLocale, isFreshRequest) => {
  if (!isFreshRequest) {
    return;
  }
  if (hsLocale) {
    setHsLocale(hsLocale);
  } else {
    clearHsLocale();
  }
};

// NOTE: This logic is mirrored in quick-fetch (which cannot depend on hs-locale-management).
// If you change the header name or how the locale is resolved, update quick-fetch too.
export const getHsLocaleHeader = () => {
  const locale = getHsLocale();
  return locale ? {
    [HS_LOCALE_HEADER]: locale
  } : {};
};