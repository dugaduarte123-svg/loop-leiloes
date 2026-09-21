const formatVersion = version => {
  if (version == null) {
    return 'unknown';
  }
  if (version === 'static') {
    return 'dev';
  }
  return version.replace('static-', '');
};
const addStaticAppParams = (url, name, version) => {
  if (!url.searchParams.has('hs_static_app')) {
    url.searchParams.set('hs_static_app', name);
  }
  if (!url.searchParams.has('hs_static_app_version')) {
    url.searchParams.set('hs_static_app_version', version);
  }
};

/**
 * Tags the request with the app's static-app identity so the API gateway can
 * make its CORS allow-origin decision. Mirrors hub-http's `ensureStaticAppInfo`:
 * appends the `hs_static_app` / `hs_static_app_version` query params (when
 * absent) to `string` and `URL` inputs. `Request` inputs (whose URL is
 * immutable) pass through unchanged. No-ops when `currentPackage.name` is absent.
 */
export const withStaticAppInfo = (params, context) => {
  const appInfo = context.currentPackage;
  if (!(appInfo !== null && appInfo !== void 0 && appInfo.name)) {
    return params;
  }
  const formattedVersion = formatVersion(appInfo.version);
  let {
    input
  } = params;
  if (typeof input === 'string') {
    try {
      const url = new URL(input);
      addStaticAppParams(url, appInfo.name, formattedVersion);
      input = url.toString();
    } catch (_unused) {
      // Relative/invalid URL string — skip query param injection
    }
  } else if (input instanceof URL) {
    const url = new URL(input.toString());
    addStaticAppParams(url, appInfo.name, formattedVersion);
    input = url;
  }
  return Object.assign({}, params, {
    input
  });
};