import { getUuid } from '../utils/hsGenerator';
import { prepareVisitorIdentifiers } from '../utk/prepareVisitorIdentifiers';
import { getScriptEnvParams } from './envGetters';
import EmbedScriptContext from './EmbedScriptContext';
import { getIdentificationEmail, getIdentificationToken } from '../external-api/settingsHelpers';
export function createEmbedScriptContext() {
  var _window;
  const {
    messagesEnv,
    portalId,
    messagesHublet
  } = getScriptEnvParams();
  let useLocalBuild = false;
  try {
    useLocalBuild = localStorage && localStorage['live-chat-local-toggle'] === 'true';
    // eslint-disable-next-line no-empty
  } catch (e) {}
  const iFrameDomainOverride = ((_window = window) === null || _window === void 0 || (_window = _window.messagesConfig) === null || _window === void 0 ? void 0 : _window.iFrameDomain) || '';
  const iframeUuid = getUuid();
  const referrer = encodeURIComponent(document.referrer);
  const {
    messagesUtk,
    hubspotUtk,
    hstc,
    hssc,
    globalCookieOptOut,
    isFirstVisitorSession
  } = prepareVisitorIdentifiers();
  return new EmbedScriptContext({
    messagesHublet,
    globalCookieOptOut,
    hubspotUtk,
    hstc,
    hssc,
    iFrameDomainOverride,
    iframeUuid,
    isFirstVisitorSession,
    messagesEnv,
    messagesUtk,
    referrer,
    portalId,
    useLocalBuild,
    identificationEmail: getIdentificationEmail(),
    identificationToken: getIdentificationToken()
  });
}