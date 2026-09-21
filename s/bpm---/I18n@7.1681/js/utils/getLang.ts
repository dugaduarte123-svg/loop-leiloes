import { I18nInternal as I18n } from '../internal/i18n-internal';
export default (() => {
  // Hack: To distinguish between the UI languages 'zh-cn' and 'zh-tw' and match the contents of i18n-data's baseLocales file,
  //       I18n.getLang() should return 'zh-cn' instead of 'zh' when the language is set to Simplified Chinese
  //       I18n.getLang() should continue to return 'zh' when the language is set to Traditional Chinese
  if (I18n.langEnabled && I18n.locale === 'zh-cn') {
    return 'zh-cn';
  }
  const lang = I18n.locale.split('-')[0];
  return lang !== 'en' && !I18n.langEnabled && !I18n.publicPage ? 'en' : lang;
});