/**
 * Get a cookie value by name, if it exists. The returned value is
 * URL-decoded once (via `decodeURIComponent`).
 */
export function getCookie(name, cookie) {
  const matches = cookie.match(`(?:^|;\\s*)${name}=(.*?)(?:;|$)`);
  if (!matches) {
    return undefined;
  }
  try {
    return decodeURIComponent(matches[1]);
  } catch (_unused) {
    // Malformed percent-encoding — treat as an absent cookie rather than
    // throwing out of the caller (keeps the auth getters' no-op contract).
    return undefined;
  }
}