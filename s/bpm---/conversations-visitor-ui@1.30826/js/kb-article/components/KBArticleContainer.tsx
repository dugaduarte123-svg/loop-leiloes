import KBArticle from 'conversations-visitor-experience-components/knowledge-base/KBArticle';
import { useKBArticle } from '../kbArticleSelectors';
import { getVisitorIdentification } from '../../visitor-identity/operators/getVisitorIdentificationEnabled';
import { useSelector } from 'react-redux';
import { getIfSelectedKBIsLatest } from '../../selectors/widgetDataSelectors/getIfSelectedKBIsLatest';
import useIsSpotlightLauncher from '../../hooks/useIsSpotlightLauncher';
import SpotlightKBArticleWrapper from './SpotlightKBArticleWrapper';
import { jsx as _jsx } from "react/jsx-runtime";
function KBArticleContainer() {
  const kbArticle = useKBArticle();
  const visitorIdentification = useSelector(getVisitorIdentification);
  const selectedKBIsLatest = useSelector(getIfSelectedKBIsLatest);
  const isSpotlight = useIsSpotlightLauncher();
  const article = /*#__PURE__*/_jsx(KBArticle, {
    kbArticle: kbArticle,
    visitorIdentification: visitorIdentification,
    isKnowledgeBaseV3: selectedKBIsLatest
  });
  if (isSpotlight) {
    return /*#__PURE__*/_jsx(SpotlightKBArticleWrapper, {
      children: article
    });
  }
  return article;
}
KBArticleContainer.displayName = 'KBArticleContainer';
export default KBArticleContainer;