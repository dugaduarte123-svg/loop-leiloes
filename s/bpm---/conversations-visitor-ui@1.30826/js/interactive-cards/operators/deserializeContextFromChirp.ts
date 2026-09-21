function isChirpFieldValue(value) {
  return typeof value === 'object' && value !== null && '@type' in value && typeof value['@type'] === 'string';
}
function fromChirpFieldValue(value) {
  switch (value['@type']) {
    case 'null':
      return null;
    case 'boolean':
    case 'integer':
    case 'long':
    case 'float':
    case 'double':
    case 'string':
      return value.value;
    case 'list':
      return value.value.map(fromChirpFieldValue);
    case 'map':
      return Object.fromEntries(Object.entries(value.value).map(([k, v]) => [k, fromChirpFieldValue(v)]));
    default:
      return null;
  }
}
export function deserializeContextFromChirp(context) {
  return Object.fromEntries(Object.entries(context).map(([k, v]) => [k, isChirpFieldValue(v) ? fromChirpFieldValue(v) : v]));
}