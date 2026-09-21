export const isOnPortalsPlatform = () => {
  var _document$querySelect;
  return !!((_document$querySelect = document.querySelector('meta[name="x-hs-portals-instance-id"]')) !== null && _document$querySelect !== void 0 && _document$querySelect.getAttribute('content'));
};