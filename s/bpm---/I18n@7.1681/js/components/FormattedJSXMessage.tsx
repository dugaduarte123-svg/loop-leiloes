import { c as _c } from "react-compiler-runtime";
import * as React from 'react';
import FormattedMessage from './FormattedMessage';
import I18n from 'I18n';
import { I18nHMRContext } from '../internal/i18n-internal';
import { jsx as _jsx } from "react/jsx-runtime";
const defaultElements = {
  wrapper: 'span'
};
function createElement(elements, type, ...args) {
  return /*#__PURE__*/React.createElement(
  // @ts-ignore Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  elements && elements[type] ||
  // @ts-ignore dynamic key access
  defaultElements[type] || defaultElements.wrapper,
  // @ts-ignore spread args for React.createElement
  ...args);
}
function renderMissingOrInvalidKey(props) {
  console.warn(`I18n: FormattedJSXMessage called with missing or non-JSX message key ${props.message}. See go/i18n-react for more info.`);
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: props.message,
    options: props.options
  });
}
const isSet = value => {
  return value !== undefined && value !== null;
};
const FormattedJSXMessage = props => {
  const $ = _c(3);
  React.useContext(I18nHMRContext);
  let t0;
  let t1;
  if ($[0] !== props) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      var _props$options;
      let fn = I18n.lookup(props.message, {
        locale: (props === null || props === void 0 || (_props$options = props.options) === null || _props$options === void 0 ? void 0 : _props$options.locale) || (I18n.langEnabled ? I18n.locale : "en")
      });
      if (!isSet(fn)) {
        t1 = renderMissingOrInvalidKey(props);
        break bb0;
      }
      const count = props.options && props.options.count;
      const countIsSet = isSet(count);
      if (typeof fn === "object" && countIsSet) {
        const pluralizer = I18n.pluralization.get();
        const keys = pluralizer(count);
        while (keys.length) {
          const key = keys.shift();
          if (isSet(fn[key])) {
            fn = fn[key];
            break;
          }
        }
      }
      const formattedProps = Object.assign({}, props.options);
      if (countIsSet && typeof count === "number") {
        formattedProps.count = I18n.formatNumber(count);
      } else {
        if (typeof fn === "string") {
          t1 = renderMissingOrInvalidKey(props);
          break bb0;
        }
      }
      t0 = fn(createElement, props.elements, formattedProps);
    }
    $[0] = props;
    $[1] = t0;
    $[2] = t1;
  } else {
    t0 = $[1];
    t1 = $[2];
  }
  if (t1 !== Symbol.for("react.early_return_sentinel")) {
    return t1;
  }
  return t0;
};
export default FormattedJSXMessage;