const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+(?:@|%40)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
const REDACTED_EMAIL = '[REDACTED_EMAIL]';
export function redactEmailsFromPathname(pathname) {
  return pathname.replace(EMAIL_PATTERN, REDACTED_EMAIL);
}
const SENSITIVE_PARAMS = ['access_token', 'refresh_token', 'id_token', 'client_secret', 'code', 'state', 'token', 'assertion', 'client_assertion', 'password', 'secret', 'api_key', 'apikey'];
const REDACTED = '*REDACTED*';
function isSensitiveParam(paramName) {
  const lowerParam = paramName.toLowerCase();
  return SENSITIVE_PARAMS.some(sensitive => lowerParam === sensitive);
}
function isUrl(value) {
  try {
    void new URL(value);
    return true;
  } catch (_unused) {
    return false;
  }
}
export function redactUrl(url) {
  try {
    const urlObj = new URL(url);
    const paramsToRedact = [];
    urlObj.searchParams.forEach((_, key) => {
      if (isSensitiveParam(key)) {
        paramsToRedact.push(key);
      }
    });
    paramsToRedact.forEach(param => {
      urlObj.searchParams.set(param, REDACTED);
    });
    const urlValuedParams = [];
    urlObj.searchParams.forEach((value, key) => {
      if (isUrl(value)) {
        urlValuedParams.push(key);
      }
    });
    urlValuedParams.forEach(param => {
      urlObj.searchParams.set(param, REDACTED);
    });
    if (urlObj.hash && urlObj.hash.includes('=')) {
      const hashParams = new URLSearchParams(urlObj.hash.slice(1));
      const redactedHash = new URLSearchParams();
      hashParams.forEach((_, key) => {
        redactedHash.set(key, REDACTED);
      });
      urlObj.hash = `#${redactedHash.toString()}`;
    }
    return urlObj.toString();
  } catch (_unused2) {
    return REDACTED;
  }
}