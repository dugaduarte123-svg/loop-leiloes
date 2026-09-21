import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["use"];
import styled from 'styled-components';
import { getStatusVariationBackgroundColor } from './utils/getStatusTagStyles';
import { jsx as _jsx } from "react/jsx-runtime";
const AbstractVizExStatusTag = styled.div.withConfig({
  displayName: "VizExStatusTag__AbstractVizExStatusTag"
})(["position:relative;display:inline-flex;::after{content:'';border-radius:50%;height:10px;width:10px;background-color:", ";}"], ({
  theme,
  use
}) => `${getStatusVariationBackgroundColor({
  theme,
  use
})}`);
const VizExStatusTag = props => {
  const {
      use
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsx(AbstractVizExStatusTag, Object.assign({}, rest, {
    use: use
  }));
};
VizExStatusTag.displayName = 'VizExStatusTag';
export default VizExStatusTag;