export function getChatflowTagFromQueryParams() {
  // eslint-disable-next-line compat/compat
  const url = new URL(window.location.href);
  return url.searchParams.get('chatflow') || '';
}