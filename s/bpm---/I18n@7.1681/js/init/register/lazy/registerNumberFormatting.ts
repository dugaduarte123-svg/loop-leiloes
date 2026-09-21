// @ts-ignore `i18n-data/data/modern/locales/en` is untyped
import numberFormatting from 'i2l!i18n-data/data/modern/locales/en';
import { getLangEnabledLocales } from '../../internal/legacyI18nInit';
export default (Provider => Provider.register(numberFormatting, {
  getLocales: getLangEnabledLocales,
  type: 'pojo'
}));