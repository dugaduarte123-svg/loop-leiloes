import get from 'transmute/get';
import createPublicI18nProvider from 'I18n/init/providers/createPublicI18nProvider';
import registerBasicData from 'I18n/init/register/lazy/registerBasicData';
import lang from 'i2l?query=sporks!../../lang/en.lyaml';
import enviro from 'enviro';
function browserDefaultLanguage() {
  var _window;
  const defaultLanguage = ((_window = window) === null || _window === void 0 || (_window = _window.navigator) === null || _window === void 0 || (_window = _window.languages) === null || _window === void 0 ? void 0 : _window[0]) || window.navigator.language;
  return (defaultLanguage === null || defaultLanguage === void 0 ? void 0 : defaultLanguage.toLowerCase()) || null;
}
function shouldTrackFallbacks() {
  try {
    return !enviro.isProd() && localStorage && !localStorage.getItem('TRACK_I18N_FALLBACK_TRANSLATIONS');
  } catch (e) {
    return false;
  }
}
export const initializeI18n = ({
  data = {}
} = {}) => {
  if (shouldTrackFallbacks()) {
    /* eslint-disable-next-line hubspot-dev/no-unsafe-storage */
    localStorage.setItem('TRACK_I18N_FALLBACK_TRANSLATIONS', 'true');
  }
  const preferredLanguage = get('language', data);
  const i18nConfig = preferredLanguage ? {
    locale: preferredLanguage,
    langEnabled: true
  } : {
    locale: browserDefaultLanguage(),
    langEnabled: true
  };
  const I18nProvider = createPublicI18nProvider({
    manuallySetLocale: true
  });
  const langAvailable = Promise.all([I18nProvider.register(lang), registerBasicData(I18nProvider)]);
  I18nProvider.setLocale(i18nConfig);
  return langAvailable;
};