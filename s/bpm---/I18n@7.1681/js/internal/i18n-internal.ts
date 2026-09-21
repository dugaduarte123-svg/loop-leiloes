/* hs-eslint ignored failing-rules */
/* eslint-disable hubspot-dev/no-unsafe-i18n-at-module-eval */
import I18n from 'I18n';
import { createContext } from 'react';
const I18nInternal = I18n;
export const I18nHMRContext = /*#__PURE__*/createContext({});
export { I18nInternal };