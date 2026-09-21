import PortalIdParser from 'PortalIdParser';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import VizExLoadingSpinner from 'visitor-ui-component-library/loading/VizExLoadingSpinner';
import hashCode from './utils/hashCode';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const ArticleWrapper = styled.div.withConfig({
  displayName: "KBArticle__ArticleWrapper"
})(["width:100%;flex:1;min-height:0;overflow:hidden;"]);
const LoadingWrapper = styled.div.withConfig({
  displayName: "KBArticle__LoadingWrapper"
})(["display:flex;justify-content:center;align-items:center;height:100%;"]);
function KBArticle({
  kbArticle,
  visitorIdentification,
  isKnowledgeBaseV3 = true
}) {
  const [isLoading, setIsLoading] = useState(true);
  const {
    deepLink,
    hubSpotContentId,
    hubSpotContentTextFragment
  } = kbArticle;
  const portalId = PortalIdParser.get();
  // anchorName is used for caching purposes even if article isn't from a citation
  const anchorName = hubSpotContentTextFragment ? `aicitation-${hashCode(hubSpotContentTextFragment)}` : `${portalId}${hubSpotContentId}`;
  const encodedOrigin = encodeURIComponent(window.location.origin);
  const onDomainUrl = useMemo(() => {
    let url;
    try {
      url = new URL(deepLink);
    } catch (_unused) {
      return null;
    }
    // The KB article iframe must only ever load content over http(s). Rejecting
    // any other protocol here prevents a `javascript:`/`data:`/`blob:` deepLink
    // from being used as the iframe `src` (DOM XSS -> ATO). This is a strict
    // allowlist (stricter than the shared isSafeLink blocklist) because an
    // iframe src, unlike a user-facing link, should never be anything but http(s).
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    url.pathname = '_hcms/customer-agent-embed';
    if (isKnowledgeBaseV3) {
      url.pathname = '_hcms/livechat/embedded-content';
    }
    url.searchParams.set('hubSpotContentType', 'KB_ARTICLE');
    url.searchParams.set('portalId', portalId.toString());
    url.searchParams.set('hubSpotContentId', hubSpotContentId);
    if (hubSpotContentTextFragment) {
      url.searchParams.set('contentTextFragment', hubSpotContentTextFragment);
      url.hash = anchorName;
    }
    url.searchParams.set('origin', encodedOrigin);
    url.searchParams.set('anchorName', anchorName);
    if (visitorIdentification !== null && visitorIdentification !== void 0 && visitorIdentification.identificationToken) {
      url.searchParams.set('identificationToken', visitorIdentification.identificationToken);
    }
    if (visitorIdentification !== null && visitorIdentification !== void 0 && visitorIdentification.identificationEmail) {
      url.searchParams.set('email', visitorIdentification.identificationEmail);
    }
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
    }
    return url;
  }, [portalId, hubSpotContentId, hubSpotContentTextFragment, encodedOrigin, anchorName, deepLink, visitorIdentification === null || visitorIdentification === void 0 ? void 0 : visitorIdentification.identificationToken, visitorIdentification === null || visitorIdentification === void 0 ? void 0 : visitorIdentification.identificationEmail, isKnowledgeBaseV3]);
  if (!onDomainUrl) {
    return null;
  }
  return /*#__PURE__*/_jsxs(ArticleWrapper, {
    children: [isLoading && /*#__PURE__*/_jsx(LoadingWrapper, {
      children: /*#__PURE__*/_jsx(VizExLoadingSpinner, {})
    }), /*#__PURE__*/_jsx("iframe", {
      src: onDomainUrl.toString(),
      style: {
        width: '100%',
        height: '100%',
        border: 'none'
      },
      id: 'kb-article-iframe',
      onLoad: () => setIsLoading(false)
    })]
  });
}
KBArticle.displayName = 'KBArticle';
export default KBArticle;