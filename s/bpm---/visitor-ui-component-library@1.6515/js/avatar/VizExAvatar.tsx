import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["size", "src", "contentStyle", "alt"];
import styled, { css } from 'styled-components';
import { MEDIUM } from '../constants/sizes';
import { AVATAR_SIZES } from './constants/AvatarSizes';
// @ts-ignore Bender URL's aren't typed
import defaultAvatar from 'bender-url!../../img/default-avatar.png';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const getSizeStyles = ({
  size
}) => {
  const sizePx = AVATAR_SIZES[size];
  return css(["height:", "px;width:", "px;"], sizePx, sizePx);
};
const VizExAvatarWrapper = styled.div.withConfig({
  displayName: "VizExAvatar__VizExAvatarWrapper"
})(["display:inline-flex;align-items:center;justify-content:center;box-sizing:content-box;font-size:initial;overflow:hidden;position:relative;border-radius:50%;", ";"], getSizeStyles);
const VizExAvatarContent = styled.div.withConfig({
  displayName: "VizExAvatar__VizExAvatarContent"
})(["background-image:url(", ");background-position:center center;background-size:cover;height:100%;width:100%;"], ({
  src
}) => `"${src}"`);
const VizExAvatarImg = styled.img.withConfig({
  displayName: "VizExAvatar__VizExAvatarImg"
})(["border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;"]);
const VizExAvatar = _ref => {
  let {
      size = MEDIUM,
      src = defaultAvatar,
      contentStyle,
      alt = ''
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  return /*#__PURE__*/_jsxs(VizExAvatarWrapper, Object.assign({}, rest, {
    size: size,
    children: [/*#__PURE__*/_jsx(VizExAvatarContent, {
      src: src,
      style: contentStyle
    }), /*#__PURE__*/_jsx(VizExAvatarImg, {
      src: src,
      alt: alt
    })]
  }));
};
VizExAvatar.displayName = 'VizExAvatar';
export default VizExAvatar;