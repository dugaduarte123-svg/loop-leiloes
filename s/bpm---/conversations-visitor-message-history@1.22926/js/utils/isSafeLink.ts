// Protocols derived from https://git.hubteam.com/HubSpot/sanitize-text/blob/master/static/js/transformers/removeInvalidAnchorProtocols.ts
// `blob:` is added on top of that list: a blob: href can open attacker-authored
// HTML in a new tab, and no legitimate link/quick-link value uses it.
// eslint-disable-next-line no-script-url
const BLOCKLISTED_PROTOCOLS = ['javascript:', 'vbscript:', 'data:', 'blob:'];
export const isSafeLink = url => {
  try {
    const _url = new URL(url);
    return !BLOCKLISTED_PROTOCOLS.includes(_url.protocol);
  } catch (_unused) {
    return false;
  }
};