// for mocking in tests
export function getHostname() {
  return window.location.hostname;
}

export function getPathname() {
  return window.location.pathname;
}

export function isWebdriver(): boolean {
  return window.navigator.webdriver;
}

export function getQueryParams() {
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return Object.fromEntries(urlParams);
  } catch {
    // do nothing
  }
  return {};
}
