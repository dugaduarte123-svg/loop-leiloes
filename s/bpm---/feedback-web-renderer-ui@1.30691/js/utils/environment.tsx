// eslint-disable-next-line hubspot-dev/no-confusing-browser-globals
const getLocation = () => location;
const bundleRegex = /^.*hsappstatic\.net\/feedback-web-renderer-ui\/static-(\d+(?:-\w+-?)*\.\d+).*$/;
const bundleSrc = [].slice.call(document.getElementsByTagName('script')).map(el => el.src).filter(src => bundleRegex.test(src))[0];
export const bundleVersion = bundleSrc && bundleRegex.exec(bundleSrc) ? bundleRegex.exec(bundleSrc)[1] : 'unknown';
export const isQa = !/hubspot\.com$/.test(getLocation().host);
export const randomUtk = URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, '');
export const utk = document.location.pathname.indexOf('nps') >= 0 ? '9ad8af7d2932511253462d708b7f9fe3' : randomUtk;
export const parentUrl = getLocation().href;