// Based on JS implementations of Java's HashCode
// https://git.hubteam.com/HubSpot/newrelic-snippet-source/blob/87ac997cfbf744e8da6104e83daf07b39609dc78/feature/err/aggregate/string-hash-code.js
function hashCode(text) {
  let hash = 0;
  let charVal;
  if (!text || !text.length) return hash;
  for (let i = 0; i < text.length; i++) {
    charVal = text.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + charVal;
    // eslint-disable-next-line no-bitwise
    hash = hash | 0; // Convert to 32bit integer
  }
  return hash;
}
export default hashCode;