import I18n from 'I18n';
import styled, { css } from 'styled-components';
import SVGCollapse from 'visitor-ui-component-library-icons/icons/SVGCollapse';
import SVGExpand from 'visitor-ui-component-library-icons/icons/SVGExpand';
import SVGExternalLink from 'visitor-ui-component-library-icons/icons/SVGExternalLink';
import SVGLeft from 'visitor-ui-component-library-icons/icons/SVGLeft';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import VizExLink from 'visitor-ui-component-library/link/VizExLink';
import { hexToRgba } from 'visitor-ui-component-library/utils/hexToRgba';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { isSafeLink } from 'conversations-visitor-message-history/utils/isSafeLink';
import { useWidgetResizeContext } from '../../contexts/WidgetResizeContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const focusRingOverride = css(["", ""], ({
  theme
}) => getFocusRingStyles({
  ringColor: theme.colors.textOnPrimary
}));
const KBArticleHeaderWrapper = styled.div.withConfig({
  displayName: "KBArticleHeader__KBArticleHeaderWrapper"
})(["display:flex;justify-content:space-between;width:100%;"]);
const KBArticleHeaderIconButton = styled(VizExIconButton).withConfig({
  displayName: "KBArticleHeader__KBArticleHeaderIconButton"
})(["", ""], focusRingOverride);
const KBArticleHeaderIcon = styled(VizExIcon).withConfig({
  displayName: "KBArticleHeader__KBArticleHeaderIcon"
})(["font-size:16px;"]);
const FlexWrapper = styled.div.withConfig({
  displayName: "KBArticleHeader__FlexWrapper"
})(["display:flex;"]);
const StyledVizExLink = styled(VizExLink).withConfig({
  displayName: "KBArticleHeader__StyledVizExLink"
})(["display:flex;align-items:center;justify-content:center;width:40px;margin-left:24px;color:", ";border-radius:3px;&:hover{color:", ";background-color:", ";}", ""], ({
  theme
}) => theme.colors.textOnPrimary, ({
  theme
}) => theme.colors.textOnPrimary, ({
  theme
}) => hexToRgba(theme.colors.textOnPrimary, 0.1), focusRingOverride);
function KBArticleHeader({
  browserWindowHeight,
  inline,
  kbArticleDeepLink,
  restorePreviousViewFromKBArticle,
  mobile,
  toggleWidgetSizeForKBArticle,
  viewKBArticleExpanded,
  preview
}) {
  const {
    isResizeEnabled
  } = useWidgetResizeContext();
  return /*#__PURE__*/_jsxs(KBArticleHeaderWrapper, {
    children: [/*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx(KBArticleHeaderIconButton, {
        onClick: () => restorePreviousViewFromKBArticle(),
        use: "transparent-on-primary",
        "aria-label": I18n.text('conversations-visitor-experience-components.knowledgeBase.kbArticle.backToChat'),
        children: /*#__PURE__*/_jsx(VizExIcon, {
          icon: /*#__PURE__*/_jsx(SVGLeft, {}),
          size: "md"
        })
      })
    }), /*#__PURE__*/_jsxs(FlexWrapper, {
      children: [!(mobile || inline || preview || isResizeEnabled) && /*#__PURE__*/_jsx(KBArticleHeaderIconButton, {
        onClick: () => toggleWidgetSizeForKBArticle(browserWindowHeight),
        use: "transparent-on-primary",
        "aria-label": viewKBArticleExpanded ? I18n.text('conversations-visitor-experience-components.knowledgeBase.kbArticle.collapse') : I18n.text('conversations-visitor-experience-components.knowledgeBase.kbArticle.expand'),
        children: viewKBArticleExpanded ? /*#__PURE__*/_jsx(KBArticleHeaderIcon, {
          icon: /*#__PURE__*/_jsx(SVGCollapse, {})
        }) : /*#__PURE__*/_jsx(KBArticleHeaderIcon, {
          icon: /*#__PURE__*/_jsx(SVGExpand, {})
        })
      }), isSafeLink(kbArticleDeepLink) && /*#__PURE__*/_jsx(StyledVizExLink, {
        href: kbArticleDeepLink,
        "aria-label": I18n.text('conversations-visitor-experience-components.knowledgeBase.kbArticle.openInNewTab'),
        target: "_blank",
        rel: "noopener noreferrer",
        children: /*#__PURE__*/_jsx(KBArticleHeaderIcon, {
          icon: /*#__PURE__*/_jsx(SVGExternalLink, {})
        })
      })]
    })]
  });
}
KBArticleHeader.displayName = 'KBArticleHeader';
export default KBArticleHeader;