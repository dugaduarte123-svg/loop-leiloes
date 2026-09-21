import { Record } from 'immutable';
import get from 'transmute/get';
import ErrorMessageTokens from './ErrorMessageTokens';
const SendFailure = Record({
  localizedErrorKey: null,
  errorMessage: null,
  errorMessageTokens: null,
  retryable: false
}, 'SendFailure');
// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  if (!props) return SendFailure();
  const localizedErrorKey = get('localizedErrorKey', props) || null;
  const errorMessage = get('errorMessage', props) || null;
  const errorMessageTokensPojo = get('errorMessageTokens', props) || null;
  const errorMessageTokens = errorMessageTokensPojo && ErrorMessageTokens(errorMessageTokensPojo);
  const retryable = get('retryable', props) || false;
  return SendFailure({
    localizedErrorKey,
    errorMessage,
    errorMessageTokens,
    retryable
  });
}