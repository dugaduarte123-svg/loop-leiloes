import styled from 'styled-components';
import SVGBlog from 'visitor-ui-component-library-icons/icons/SVGBlog';
import { NEUTRAL_800, NEUTRAL_900 } from 'visitor-ui-component-library/constants/WidgetColors';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const Wrapper = styled.ul.withConfig({
  displayName: "ArticlesList__Wrapper"
})(["display:flex;flex-direction:column;gap:8px;padding:0;list-style:none;margin:0;"]);
const Title = styled.div.withConfig({
  displayName: "ArticlesList__Title"
})(["font-size:14px;font-weight:600;line-height:18px;"]);
const Subtitle = styled.div.withConfig({
  displayName: "ArticlesList__Subtitle"
})(["font-size:12px;line-height:18px;color:", ";"], NEUTRAL_800);
const ListItemWrapper = styled.button.withConfig({
  displayName: "ArticlesList__ListItemWrapper"
})(["padding:8px;color:currentColor;gap:16px;display:flex;justify-content:flex-start;align-items:flex-start;list-style:none;background:none;border:none;width:100%;text-align:left;&:not(:disabled):hover{color:", ";}"], ({
  coloring: {
    useDefaultColor,
    accentColor
  }
}) => useDefaultColor ? NEUTRAL_900 : accentColor);
const ArticlesList = ({
  items,
  hideSubtitle = false,
  onArticleClick,
  coloring,
  disabled = false
}) => {
  return /*#__PURE__*/_jsx(Wrapper, {
    children: items.map(article => /*#__PURE__*/_jsx("li", {
      children: /*#__PURE__*/_jsxs(ListItemWrapper, {
        coloring: coloring,
        onClick: () => onArticleClick === null || onArticleClick === void 0 ? void 0 : onArticleClick(article),
        role: "button",
        disabled: disabled,
        children: [/*#__PURE__*/_jsx(SVGBlog, {
          style: {
            flexShrink: 0,
            fill: 'currentColor',
            marginTop: 2
          },
          width: 16,
          height: 16
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(Title, {
            children: article.name
          }), !hideSubtitle && article.knowledgeCategoryName && /*#__PURE__*/_jsx(Subtitle, {
            children: article.knowledgeCategoryName
          })]
        })]
      })
    }, article.id))
  });
};
export default ArticlesList;
ArticlesList.displayName = 'ArticlesList';