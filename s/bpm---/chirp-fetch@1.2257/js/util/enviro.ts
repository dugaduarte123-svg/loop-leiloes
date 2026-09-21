// Straight copy/paste from https://git.hubteam.com/HubSpot/enviro

// hubspot-url-utils/pure requires this file but it isn't available during earlyRequests
// Trimmed down to only the functions we need

/* eslint-disable hubspot-dev/no-hublet-comparison */
/* eslint-disable hubspot-dev/no-hublet-references */

const SUBDOMAINS = ['api', 'local', 'app', 'private', 'platform', 'tools', 'meetings', 'payments', 'mcp'];
const COM_DOMAINS = ['hubspot', 'hubteam', 'grader', 'getsignals', 'getsidekick', 'gettally', 'hubspotemail', 'customer-hub', 'hubspotservicehub', 'hubspotquote', 'hubspotdocuments', 'hubspotrecap', 'hs-data-privacy'

// connect.com and wthubspot.com intentionally not included here due to mismatching qa tld
];
const NET_DOMAINS = ['hubspotstarter', 'hubspotfree', 'hubspotemail'];
const ORG_DOMAINS = ['growth'];
const AI_DOMAINS = ['breeze'];
const DOMAINS = {
  com: COM_DOMAINS.join('|'),
  net: NET_DOMAINS.join('|'),
  org: ORG_DOMAINS.join('|'),
  ai: AI_DOMAINS.join('|')
};
const createEnviro = function createEnviro(location) {
  const qaRe = new RegExp(`${Object.entries(DOMAINS).map(([tld, regexList]) => `(?:${regexList})qa\\.${tld}`).join('|')}|(?:connect)qa\\.co|wthubspot\\.(com|de|es|fr|jp)|hsqa-sales(?:crm)?-sub\\.com|(?:hubspotstarter|hubspotfree|hubspotemail)(qa)(?:-.*)\\.net|(?:hubspotemail)(qa)(?:-.*)\\.com`);
  const hubletRe = new RegExp(`^(?:${SUBDOMAINS.join('|')})-(.*).(?:hubspot|hubteam)(?:qa)?.com`);
  const hubspotQuoteHubletRe = new RegExp(`^(.*).(?:hubspotquote)(?:qa)?.com`);
  const hubspotDocumentsHubletRe = new RegExp(`^app-(.*).(?:hubspotdocuments)(?:qa)?.com`);
  const hubspotRecapHubletRe = new RegExp(`^app-(.*).(?:hubspotrecap)(?:qa)?.com`);
  const breezeArtifactsHubletRe = new RegExp(`^artifacts-(.*).(?:breeze)(?:qa)?.ai`);
  const hubspotSalesSubRe = new RegExp('^(?:[0-9]+).(.*).hs(?:qa)?-sales(?:crm)?-sub.com');
  const hubspotSalesSubBase54Re = new RegExp('^(?:[a-zA-Z0-9]+-[a-zA-Z0-9]+)\\.([a-z0-9]+)\\.hs(?:qa)?-sales(?:crm)?-sub\\.com');
  const hubspotFreeStarterHubletRe = new RegExp('^hs-(?:[0-9]+).s.(?:hubspotfree|hubspotstarter|hubspotemail)(?:qa)?-(.*).net');
  const hubspotEmailHubletRe = new RegExp('^hs-(?:[0-9]+).s.(?:hubspotemail)(?:qa)?-(.*).com');
  const sidekickOpenHubletRe = new RegExp('^t.sidekickopen(?:\\d)+-([a-z]+[0-9]).com');
  const hsDataPrivacyHubletRe = new RegExp('^([a-z]+[0-9]).hs-data-privacy(?:qa)?.com');
  const HUBLET_REGEXPS = [hubletRe, hubspotQuoteHubletRe, hubspotDocumentsHubletRe, hubspotRecapHubletRe, breezeArtifactsHubletRe, hubspotSalesSubRe, hubspotSalesSubBase54Re, hubspotFreeStarterHubletRe, hubspotEmailHubletRe, sidekickOpenHubletRe, hsDataPrivacyHubletRe];
  const defaultKey = 'ENV';
  const DEFAULT_NOT_SUPPORTED_ERROR_MSG = 'Enviro error: the default argument for .get and .getShort is no longer supported';
  const getEnv = key => {
    let result = window[key];
    if (result == null) {
      try {
        result = window.sessionStorage.getItem(key);
      } catch (e) {
        // no-op
      }
    }
    if (result == null) {
      try {
        result = window.localStorage.getItem(key);
      } catch (e) {
        // no-op
      }
    }
    return result;
  };
  const getDefaultEnv = () => {
    const env = getEnv(defaultKey);
    if (env) {
      return env;
    } else if (qaRe.test(location.host)) {
      return 'qa';
    } else {
      return 'prod';
    }
  };
  const MAP = {
    prod: 'production',
    qa: 'development'
  };
  const normalize = env => {
    if (typeof env === 'string') {
      const lower = env.toLowerCase();
      return MAP[lower] || lower;
    }
    return env;
  };
  const denormalize = env => {
    env = typeof env === 'string' ? env.toLowerCase() : undefined;
    return Object.keys(MAP).find(ours => env === MAP[ours]) || env;
  };
  const get = (service, defaultVal) => {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }
    let env = null;
    if (service) {
      const parts = service.split('.').reverse();
      for (let i = 0; i < parts.length; i++) {
        const pathPart = parts[i];
        env = getEnv(`${pathPart.toUpperCase()}_ENV`);
        if (env) {
          break;
        }
      }
    }
    if (env == null) {
      const defaultEnv = getDefaultEnv();
      env = defaultEnv != null ? defaultEnv : 'qa';
    }
    return normalize(env);
  };
  const getInternal = (service, defaultVal) => {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }
    return denormalize(get(service));
  };
  const getShort = getInternal;
  const getHublet = () => {
    const hubletOverride = getEnv('HUBLET');
    if (hubletOverride) {
      return hubletOverride;
    }
    for (const regexp of HUBLET_REGEXPS) {
      if (regexp.test(location.hostname)) {
        return regexp.exec(location.hostname)[1];
      }
    }
    return 'na1';
  };
  return {
    createEnviro,
    denormalize,
    get,
    getHublet,
    getInternal,
    getShort,
    normalize
  };
};
export default createEnviro(document.location);