import { useContext } from 'react';
import { Provider } from 'react-redux';
import Url from 'urlinator/Url';
import buildStore from './buildStore';
import { parseStringBoolean } from './utils/parseStringBoolean';
import VisitorIdentity from './visitor-identity/records/VisitorIdentity';
import { VisitorIdentityContext, defaultVisitorIdentityContext } from './visitorIdentityContext/VisitorIdentityContext';
import { createWidgetUiState } from './selectors/getWidgetUiState';
import { jsx as _jsx } from "react/jsx-runtime";
const widgetShellUrl = new Url(window.location);
function getQueryParam(param) {
  return widgetShellUrl.paramValue(param);
}
function getUrl() {
  const urlParam = getQueryParam('url');
  try {
    return decodeURIComponent(urlParam);
  } catch (error) {
    return urlParam;
  }
}
let getVisitorIdentityContext = () => defaultVisitorIdentityContext;
function startRedux(initialState = {}) {
  const startOpen = parseStringBoolean(getQueryParam('startOpen'));
  const isEmbeddedInProduct = parseStringBoolean(getQueryParam('inApp53'));
  const defaultStore = Object.assign({}, initialState, {
    visitorIdentity: new VisitorIdentity({
      globalCookieOptOut: getQueryParam('globalCookieOptOut'),
      isFirstVisitorSession: parseStringBoolean(getQueryParam('isFirstVisitorSession'))
    }),
    widgetUi: createWidgetUiState({
      isAttachmentDisabled: parseStringBoolean(getQueryParam('isAttachmentDisabled')),
      isInitialInputFocusDisabled: parseStringBoolean(getQueryParam('isInitialInputFocusDisabled')),
      isFullscreen: parseStringBoolean(getQueryParam('isFullscreen')),
      mobile: parseStringBoolean(getQueryParam('mobile')),
      startOpen,
      hideWelcomeMessage: parseStringBoolean(getQueryParam('hideWelcomeMessage')),
      domain: getQueryParam('domain'),
      url: getUrl(),
      isEmbeddedInProduct,
      isInCMS: parseStringBoolean(getQueryParam('isInCMS')),
      mode: getQueryParam('mode'),
      apiEnableWidgetCookieBanner: getQueryParam('enableWidgetCookieBanner'),
      hideScrollToButton: parseStringBoolean(getQueryParam('hideScrollToButton')),
      isIOSMobile: parseStringBoolean(getQueryParam('isIOSMobile'))
    })
  });
  return buildStore(defaultStore, {
    getVisitorIdentityContext: () => getVisitorIdentityContext()
  });
}
const store = startRedux();
const ReduxProvider = ({
  children
}) => {
  const identityContext = useContext(VisitorIdentityContext);
  getVisitorIdentityContext = () => identityContext;
  return /*#__PURE__*/_jsx(Provider, {
    store: store,
    children: children
  });
};
ReduxProvider.displayName = 'ReduxProvider';
export default ReduxProvider;