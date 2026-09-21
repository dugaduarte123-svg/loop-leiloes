/**
 * Determines if provided string is a valid URL string.
 */
const isValidUrl = url => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

/**
 * Resolves URL of `url=` search parameter if truthy
 * or URL of window.location.href if `url=` is falsy.
 */
export const getWindowUrl = () => {
  const location = new URL(window.location.href);
  const url = location.searchParams.get('url');
  return url && isValidUrl(url) ? new URL(url) : location;
};