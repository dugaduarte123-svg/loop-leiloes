export const withValuesConvertedToString = params => {
  return Object.keys(params).map(key => {
    return [key, `${params[key]}`];
  });
};
export const serializeQueryParameters = params =>
// eslint-disable-next-line compat/compat
new URLSearchParams(withValuesConvertedToString(params)).toString();