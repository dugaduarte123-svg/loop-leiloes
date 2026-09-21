import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["src"];
import { isUnsafeUrl } from '../utils/isUnsafeUrl';
import styled from 'styled-components';
import { jsx as _jsx } from "react/jsx-runtime";
const StyledImg = styled.img.withConfig({
  displayName: "VizExImage__StyledImg"
})(["display:block;height:auto;max-width:100%;"]);
const VizExImage = props => {
  const {
      src
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  const isUnsafe = isUnsafeUrl(src);
  if (isUnsafe) {
    // eslint-disable-next-line no-console
    console.warn('VizExImage was given an unsafe src, defaulting to empty.');
  }
  return /*#__PURE__*/_jsx(StyledImg, Object.assign({}, rest, {
    src: isUnsafe ? undefined : src
  }));
};
VizExImage.displayName = 'VizExImage';
export default VizExImage;