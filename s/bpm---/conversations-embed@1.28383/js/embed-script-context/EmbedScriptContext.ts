import { numberInvariant } from '../invariants/numberInvariant';
import { stringInvariant } from '../invariants/stringInvariant';
import { isEmbeddedInProduct } from '../utils/isEmbeddedInProduct';
import { getInternalRequestUrl, getPublicRequestUrl, getPublicRequestUrlForMobileSDK, getCMSRequestUrl } from '../requests/urls';
import { serializeQueryParameters } from '../utils/serializeQueryParameters';
import { getIframeQueryParams } from '../utils/getIframeQueryParams';
import { isInCMS } from '../utils/isInCMS';
import { isOnPortalsPlatform } from '../utils/isOnPortalsPlatform';
import { getPerfAttributes } from '../perf/getPerfAttributes';
import { getIdentificationEmail, getIdentificationToken, shouldLoadImmediately } from '../external-api/settingsHelpers';
import { isInSDK } from 'visitor-ui-component-library/utils/isInSDK';
import { getFullUrl } from 'hubspot-url-utils';
import { na1 } from 'hubspot-url-utils/hublets';
export class EmbedScriptContext {
  constructor(properties) {
    const {
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
      identificationEmail,
      identificationToken,
      messagesHublet
    } = properties;
    stringInvariant(iframeUuid, 'iframeUuid');
    stringInvariant(messagesEnv, 'messagesEnv');
    stringInvariant(messagesUtk, 'messagesUtk');
    numberInvariant(portalId, 'portalId');
    this.globalCookieOptOut = globalCookieOptOut;
    this.hubspotUtk = hubspotUtk;
    this.hstc = hstc;
    this.hssc = hssc;
    this.iFrameDomainOverride = iFrameDomainOverride;
    this.iframeUuid = iframeUuid;
    this.isFirstVisitorSession = isFirstVisitorSession;
    this.messagesEnv = messagesEnv;
    this.messagesUtk = messagesUtk;
    this.referrer = referrer;
    this.portalId = portalId;
    this.useLocalBuild = useLocalBuild;
    this.identificationEmail = identificationEmail;
    this.identificationToken = identificationToken;
    this.messagesHublet = messagesHublet || na1;
    this.getIFrameDomain = this.getIFrameDomain.bind(this);
    this.getIFrameSrc = this.getIFrameSrc.bind(this);
    this.getInitialRequestUrl = this.getInitialRequestUrl.bind(this);
  }
  getIFrameDomain() {
    if (this.iFrameDomainOverride) {
      return this.iFrameDomainOverride;
    }
    return getFullUrl(this.useLocalBuild ? 'local' : 'app', {
      envOverride: this.messagesEnv,
      hubletOverride: this.messagesHublet
    });
  }
  getIFrameSrc() {
    const queryParams = serializeQueryParameters(getIframeQueryParams({
      messagesUtk: this.messagesUtk,
      hubspotUtk: this.hubspotUtk,
      portalId: this.portalId,
      iframeUuid: this.iframeUuid,
      globalCookieOptOut: this.globalCookieOptOut,
      isFirstVisitorSession: this.isFirstVisitorSession,
      hstc: this.hstc
    }));
    return `${this.getIFrameDomain()}/conversations-visitor/${this.portalId}/threads/utk/${this.messagesUtk}?${queryParams}`;
  }
  getEncodedIdentificationEmail() {
    let visitorEmail = this.identificationEmail;
    if (!visitorEmail.includes('@')) {
      visitorEmail = decodeURIComponent(visitorEmail);
    }
    return encodeURIComponent(visitorEmail);
  }
  getInitialRequestUrl(shouldSetIdentification) {
    if (shouldSetIdentification) {
      this.identificationEmail = getIdentificationEmail();
      this.identificationToken = getIdentificationToken();
    }
    if (isInCMS() || isOnPortalsPlatform()) {
      return getCMSRequestUrl({
        messagesUtk: this.messagesUtk,
        hubspotUtk: this.hubspotUtk,
        portalId: this.portalId,
        referrer: this.referrer,
        hstc: this.hstc,
        hssc: this.hssc,
        email: this.identificationEmail && this.getEncodedIdentificationEmail(),
        identificationToken: this.identificationToken
      });
    }
    if (isEmbeddedInProduct({
      portalId: this.portalId
    })) {
      return getInternalRequestUrl({
        messagesHublet: this.messagesHublet,
        messagesEnv: this.messagesEnv,
        messagesUtk: this.messagesUtk,
        portalId: this.portalId
      });
    }

    // Both functions take the same arguments
    const publicRequestUrlFunc = isInSDK() ? getPublicRequestUrlForMobileSDK : getPublicRequestUrl;
    return publicRequestUrlFunc({
      messagesHublet: this.messagesHublet,
      messagesEnv: this.messagesEnv,
      messagesUtk: this.messagesUtk,
      hubspotUtk: this.hubspotUtk,
      portalId: this.portalId,
      referrer: this.referrer,
      hstc: this.hstc,
      hssc: this.hssc,
      email: this.identificationEmail && this.getEncodedIdentificationEmail(),
      identificationToken: this.identificationToken
    });
  }
  getPerfAttributes() {
    const perfAttributes = getPerfAttributes({
      portalId: this.portalId,
      messagesEnv: this.messagesEnv
    });
    if (!shouldLoadImmediately() || !perfAttributes) {
      return undefined;
    }
    return perfAttributes;
  }
}
export default EmbedScriptContext;