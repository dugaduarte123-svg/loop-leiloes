import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["useGap", "message", "options"];
import { useContext, createElement } from 'react';
// @ts-ignore untyped JS module
import { classNameFix, getPassThroughProps, getValue } from './utils';
import { I18nHMRContext } from '../internal/i18n-internal';
const DEFAULT_OPTIONS = {};
function FormattedMessage(t0) {
  const {
      useGap: t1,
      message,
      options: t2
    } = t0,
    rest = _objectWithoutPropertiesLoose(t0, _excluded);
  const useGap = t1 === undefined ? false : t1;
  const options = t2 === undefined ? DEFAULT_OPTIONS : t2;
  useContext(I18nHMRContext);
  const props = classNameFix(getPassThroughProps(Object.assign({
    useGap,
    message,
    options
  }, rest)));
  return /*#__PURE__*/createElement("i18n-string", props, getValue({
    useGap,
    message,
    options
  }, true));
}
FormattedMessage.displayName = 'FormattedMessage';
FormattedMessage.isI18nElement = true;

// Consumers spyOn() this function and we don't want to require the mock to have `displayName`, and `isI18nElement`
export default FormattedMessage;