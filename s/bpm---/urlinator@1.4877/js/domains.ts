/* hs-eslint ignored failing-rules */
/* eslint-disable hubspot-dev/no-private-classes */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */

const STANDARD_LBS = {
  hubapi: ['api', 'email', 'etsu', 'feedback', 'internal', 'onboarding', 'nav', 'private', 'users', 'zorse'],
  hubspot: ['app', 'developers', 'cms2', 'cta', 'forms', 'library', 'login', 'marketplace', 'onboarding', 'payment', 'services', 'signup', 'sites', 'spitfire', 'uploads'],
  hubteam: ['graph', 'mesos', 'rodan2', 'tools', 'bootstrap', 'test']
};
const NONSTANDARD_LBS = ['sidekick', 'sidekickapp', 'hs-sites', 'mktg-grader', 'inbound', 'signals', 'private-hubteam', 'app-api'];
const STANDARD_DEFAULT_LBS = {
  hubapi: 'api',
  hubspot: 'app',
  hubteam: 'tools'
};
const NONSTANDARD_LB_CONFIGS = {
  sidekick: {
    true: {
      true: 'local.getsidekick.com',
      false: 'api.getsidekick.com'
    },
    false: {
      true: 'local.getsidekickqa.com',
      false: 'api.getsidekickqa.com'
    }
  },
  sidekickapp: {
    true: {
      true: 'local.getsidekick.com',
      false: 'app.getsidekick.com'
    },
    false: {
      true: 'local.getsidekickqa.com',
      false: 'app.getsidekickqa.com'
    }
  },
  ['hs-sites']: {
    true: {
      true: 'local.hs-sites.com',
      false: 'hs-sites.com'
    },
    false: {
      true: 'local.qa.hs-sites.com',
      false: 'qa.hs-sites.com'
    }
  },
  ['mktg-grader']: {
    true: {
      true: 'local.grader.com',
      false: 'marketing.grader.com'
    },
    false: {
      true: 'local.graderqa.com',
      false: 'marketing.graderqa.com'
    }
  },
  inbound: {
    true: {
      true: 'local.inbound.org',
      false: 'inbound.org'
    },
    false: {
      true: 'local.dev.inbound.org',
      false: 'dev.inbound.org'
    }
  },
  signals: {
    true: {
      true: 'local.getsignals.com',
      false: 'api.getsignals.com'
    },
    false: {
      true: 'local.getsignalsqa.com',
      false: 'api.getsignalsqa.com'
    }
  },
  ['private-hubteam']: {
    /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils, hubspot-dev/prefer-hubspot-url-utils */
    true: {
      true: 'local.hubteam.com',
      false: 'private.hubteam.com'
    },
    /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils, hubspot-dev/prefer-hubspot-url-utils */
    false: {
      true: 'local.hubteamqa.com',
      false: 'private.hubteamqa.com'
    }
  },
  ['app-api']: {
    /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils, hubspot-dev/prefer-hubspot-url-utils */
    true: {
      true: 'local.hubspot.com',
      false: 'api.hubspot.com'
    },
    /* eslint-disable-next-line hubspot-dev/prefer-hubspot-url-utils, hubspot-dev/prefer-hubspot-url-utils */
    false: {
      true: 'local.hubspotqa.com',
      false: 'api.hubspotqa.com'
    }
  }
};
class Domains {
  constructor() {
    this.lbDomainMap = Domains._buildLbDomainMap();
    this.domainLbMap = Domains._buildDomainLbMap(this.lbDomainMap);
  }
  static _buildLbDomainMap() {
    // [name][production?][local?] = hostname
    const map = {};
    const objKeys = Object.keys(STANDARD_LBS);
    objKeys.forEach(k => STANDARD_LBS[k].forEach(lb => map[lb] = {
      true: {
        true: `local.${k}.com`,
        false: `${lb}.${k}.com`
      },
      false: {
        true: `local.${k}qa.com`,
        false: `${lb}.${k}qa.com`
      }
    }));
    NONSTANDARD_LBS.forEach(k => map[k] = NONSTANDARD_LB_CONFIGS[k]);
    return map;
  }
  static _buildDomainLbMap(lbDomainMap) {
    const keys = [true, false];
    const map = {};
    Object.keys(lbDomainMap).forEach(lb => keys.forEach(production => keys.forEach(local => {
      let domain = lbDomainMap[lb][production][local];
      let info = map[domain];
      if (info) {
        info.lbs[lb] = true;
        info.multiple = true;
      } else {
        map[domain] = {
          defaultLb: lb,
          lbs: {
            [lb]: true
          },
          // poor man's set
          production: production,
          local: local
        };
      }
    })));
    const standardDefaultLbsObjKeys = Object.keys(STANDARD_DEFAULT_LBS);
    standardDefaultLbsObjKeys.forEach(k => {
      let lb = STANDARD_DEFAULT_LBS[k];
      map[`local.${k}qa.com`].defaultLb = lb;
      map[`local.${k}.com`].defaultLb = lb;
    });
    return map;
  }
  getDomain(lb, production = false, local = false) {
    let map = this.lbDomainMap[lb];
    if (!map) {
      return undefined;
    }
    // @ts-ignore ts-migrate(2538) FIXME: Type 'boolean' cannot be used as an index type.
    return map[production][local];
  }
  getLbInfo(domain, hint) {
    let info = this.domainLbMap[domain];
    if (!info) {
      return undefined;
    }
    let lb = info.defaultLb;
    if (hint && info.multiple && info.lbs[hint]) {
      lb = hint;
    }
    return {
      lb: lb,
      production: info.production,
      local: info.local
    };
  }
  getLb(domain, hint = undefined) {
    let info = this.getLbInfo(domain, hint);
    if (!info) {
      return undefined;
    }
    return info.lb;
  }
  getProduction(domain) {
    let info = this.getLbInfo(domain);
    if (!info) {
      return undefined;
    }
    return info.production;
  }
  getLocal(domain) {
    let info = this.getLbInfo(domain);
    if (!info) {
      return undefined;
    }
    return info.local;
  }
}
const domains = new Domains();
domains.STANDARD_LBS = STANDARD_LBS;
domains.NONSTANDARD_LBS = NONSTANDARD_LBS;
export default domains;