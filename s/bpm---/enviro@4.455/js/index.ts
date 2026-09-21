const SUBDOMAINS = ['api', 'local', 'app', 'private', 'platform', 'tools', 'meetings', 'payments', 'mcp'];
const COM_DOMAINS = ['hubspot', 'hubteam', 'grader', 'getsignals', 'getsidekick', 'gettally', 'hubspotemail', 'customer-hub', 'hubspotservicehub', 'hubspotquote', 'hubspotdocuments', 'hubspotrecap', 'hs-data-privacy'

// connect.com and wthubspot.com intentionally not included here due to mismatching qa tld
];
const NET_DOMAINS = ['hubspotstarter', 'hubspotfree', 'hubspotemail'];
const ORG_DOMAINS = ['growth'];
const DOMAINS = {
  com: COM_DOMAINS.join('|'),
  net: NET_DOMAINS.join('|'),
  org: ORG_DOMAINS.join('|')
};
const createEnviro = function createEnviro(location) {
  const deployedRe = new RegExp(`^(?!local|test|selenium)(.*\\.)?(${Object.entries(DOMAINS).map(([tld, regexList]) => `(?:${regexList})(qa)?\\.${tld}`).join('|')}|(?:connect)\\.com|(?:connect)(qa)\\.co|wthubspot\\.(com|de|es|fr|jp))$`);
  const previewAppRe = new RegExp('^(?:[^.]+)\\.(?:preview).app(-[a-z]+[0-9])?\\.hubspotqa\\.com');

  // there are two ways to represent worktrees :-(
  const localAppWorktreeRe = new RegExp('^(?:[^.]+)\\.(?:local)\\.(app|tools|private)(-[a-z]+[0-9])?\\.(hubspot|hubteam)(qa)?\\.com');
  const localAppWorktreeAltRe = new RegExp('^(?:[^.]+)\\.local(-[a-z]+[0-9])?\\.(hubspot|hubteam)(qa)?\\.com');
  const matchesDeployedPattern = deployedRe.test(location.hostname);
  const isLocalWorktree = localAppWorktreeRe.test(location.hostname) || localAppWorktreeAltRe.test(location.hostname);
  const isPreviewApp = previewAppRe.test(location.hostname);
  const isDeployed = matchesDeployedPattern && !isLocalWorktree || isPreviewApp;
  const qaRe = new RegExp(`${Object.entries(DOMAINS).map(([tld, regexList]) => `(?:${regexList})qa\\.${tld}`).join('|')}|(?:connect)qa\\.co|wthubspot\\.(com|de|es|fr|jp)|hsqa-sales(?:crm)?-sub\\.com|(?:hubspotstarter|hubspotfree|hubspotemail)(qa)(?:-.*)\\.net|(?:hubspotemail)(qa)(?:-.*)\\.com`);
  const hubletRe = new RegExp(`^(?:${SUBDOMAINS.join('|')})-(.*).(?:hubspot|hubteam)(?:qa)?.com`);
  const hubspotQuoteHubletRe = new RegExp(`^(.*).(?:hubspotquote)(?:qa)?.com`);
  const hubspotDocumentsHubletRe = new RegExp(`^app-(.*).(?:hubspotdocuments)(?:qa)?.com`);
  const hubspotRecapHubletRe = new RegExp(`^app-(.*).(?:hubspotrecap)(?:qa)?.com`);
  const hubspotSalesSubRe = new RegExp('^(?:[0-9]+).(.*).hs(?:qa)?-sales(?:crm)?-sub.com');
  const hubspotSalesSubBase54Re = new RegExp('^(?:[a-zA-Z0-9-]+)\\.([a-z0-9]+)\\.hs(?:qa)?-sales(?:crm)?-sub\\.com');
  const hubspotFreeStarterHubletRe = new RegExp('^hs-(?:[0-9]+).s.(?:hubspotfree|hubspotstarter|hubspotemail)(?:qa)?-(.*).net');
  const hubspotEmailHubletRe = new RegExp('^hs-(?:[0-9]+).s.(?:hubspotemail)(?:qa)?-(.*).com');
  const sidekickOpenHubletRe = new RegExp('^t.sidekickopen(?:\\d)+-([a-z]+[0-9]).com');
  const hsDataPrivacyHubletRe = new RegExp('^([a-z]+[0-9]).hs-data-privacy(?:qa)?.com');
  const previewAppHubletRe = new RegExp('^(?:[^.]+)\\.(?:preview|local)\\.app-([a-z]+[0-9])\\.hubspot(qa)?\\.com');

  // only this style of worktree domain is hubletized
  const localWorktreeHubletRe = new RegExp('^(?:[^.]+)\\.local-([a-z]+[0-9])\\.(hubspot|hubteam)(qa)?\\.com');
  const HUBLET_REGEXPS = [hubletRe, hubspotQuoteHubletRe, hubspotDocumentsHubletRe, hubspotRecapHubletRe, hubspotSalesSubRe, hubspotSalesSubBase54Re, hubspotFreeStarterHubletRe, hubspotEmailHubletRe, sidekickOpenHubletRe, hsDataPrivacyHubletRe, previewAppHubletRe, localWorktreeHubletRe];
  const defaultKey = 'ENV';
  const DEFAULT_NOT_SUPPORTED_ERROR_MSG = 'Enviro error: the default argument for .get and .getShort is no longer supported';
  const getEnv = key => {
    let result = window[key];
    if (result == null) {
      try {
        result = window.sessionStorage.getItem(key);
      } catch (e) {}
    }
    if (result == null) {
      try {
        result = window.localStorage.getItem(key);
      } catch (e) {}
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
  const setEnv = (key, env) => {
    window[key] = env;
    return env;
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
  const set = function set(key, env) {
    if (arguments.length === 1) {
      env = key;
      key = defaultKey;
    }
    return setEnv(key, env);
  };
  const getInternal = (service, defaultVal) => {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }
    return denormalize(get(service));
  };
  const getShort = getInternal;
  const isProd = service => getShort(service) === 'prod';
  const isQa = service => getShort(service) === 'qa';
  const deployed = service => {
    let result;
    if (typeof service === 'string') {
      result = getEnv(`${service.toUpperCase()}_DEPLOYED`);
    }
    if (result == null) {
      result = getEnv('DEPLOYED');
    }
    return result == null ? isDeployed : !!result;
  };
  const debug = (service, defaultVal = false) => {
    let result;
    if (typeof service === 'string') {
      result = getEnv(`${service.toUpperCase()}_DEBUG`);
    }
    if (result == null) {
      result = getEnv('DEBUG');
    }
    return result == null ? defaultVal : result;
  };
  const setDebug = (service, val = true) => {
    if (typeof service === 'string') {
      try {
        if (val) {
          localStorage.setItem(`${service.toUpperCase()}_DEBUG`, JSON.stringify(true));
        } else {
          localStorage.removeItem(`${service.toUpperCase()}_DEBUG`);
        }
      } catch (e) {
        setEnv(`${service.toUpperCase()}_DEBUG`, val || undefined);
      }
    } else {
      val = service != null ? service : true;
      try {
        if (val) {
          localStorage.setItem('DEBUG', JSON.stringify(val));
        } else {
          localStorage.removeItem('DEBUG');
        }
      } catch (e) {
        setEnv('DEBUG', val || undefined);
      }
    }
  };
  const enabled = (service, defaultVal = false) => {
    let result = getEnv(`${service.toUpperCase()}_ENABLED`);
    if (result == null) {
      result = JSON.stringify(defaultVal);
    }
    return `${result}`.toLowerCase() === 'true';
  };
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
  function ifHublet({
    isNa1,
    isNonNa1
  }, hublet) {
    if (!hublet) {
      hublet = getHublet();
    }
    if (hublet === 'na1') {
      return typeof isNa1 === 'function' ? isNa1(hublet) : undefined;
    } else if (typeof isNonNa1 === 'function') {
      return isNonNa1(hublet);
    }
  }
  return {
    createEnviro,
    debug,
    denormalize,
    deployed,
    enabled,
    get,
    getHublet,
    getInternal,
    getShort,
    isProd,
    isQa,
    ifHublet,
    normalize,
    set,
    setDebug
  };
};
export default createEnviro(document.location);