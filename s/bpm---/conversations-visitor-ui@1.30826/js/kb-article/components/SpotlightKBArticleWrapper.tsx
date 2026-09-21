import I18n from 'I18n';
import styled from 'styled-components';
import SVGLeft from 'visitor-ui-component-library-icons/icons/SVGLeft';
import { lighten } from 'visitor-ui-component-library/utils/colors';
import { useAppDispatch } from '../../buildStore';
import { restorePreviousViewFromKBArticle } from '../../navigation/actions/restorePreviousViewFromKBArticle';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
const KB_EMBEDDED_CONTENT_LINK_COLOR = '#1773d1';
const BackToChatLink = styled.button.withConfig({
  displayName: "SpotlightKBArticleWrapper__BackToChatLink"
})(["display:flex;align-items:center;gap:4px;padding:12px 24px 12px 30px;background:white;border:none;cursor:pointer;font-family:Rubik,sans-serif;font-size:16px;font-weight:400;line-height:22.4px;color:", ";width:100%;flex-shrink:0;transition:color 0.15s ease;&:hover{color:", ";}"], KB_EMBEDDED_CONTENT_LINK_COLOR, lighten(KB_EMBEDDED_CONTENT_LINK_COLOR, 0.15));
const BackIcon = styled.span.withConfig({
  displayName: "SpotlightKBArticleWrapper__BackIcon"
})(["display:flex;align-items:center;color:inherit;"]);
function SpotlightKBArticleWrapper({
  children
}) {
  const dispatch = useAppDispatch();
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(BackToChatLink, {
      onClick: () => dispatch(restorePreviousViewFromKBArticle()),
      "data-test-id": "spotlight-kb-back-to-chat",
      children: [/*#__PURE__*/_jsx(BackIcon, {
        children: /*#__PURE__*/_jsx(SVGLeft, {
          width: 14,
          height: 14,
          "aria-hidden": "true"
        })
      }), I18n.text('conversations-visitor-experience-components.knowledgeBase.kbArticle.backToChat')]
    }), children]
  });
}
SpotlightKBArticleWrapper.displayName = 'SpotlightKBArticleWrapper';
export default SpotlightKBArticleWrapper;