import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["use", "tabIndex", "as", "onPress"];
import styled from 'styled-components';
import { DEFAULT } from './constants/LinkVariations';
import { useLink } from '@react-aria/link';
import { useRef } from 'react';
import { mergeProps } from '@react-aria/utils';
import { linkTheme } from './theme/linkTheme';
import mergeThemeStyles from '../theme/mergeThemeStyles';
import { jsx as _jsx } from "react/jsx-runtime";
const StyledATag = styled.a.withConfig({
  displayName: "VizExLink__StyledATag"
})(["", ""], ({
  theme
}) => mergeThemeStyles({
  component: 'Link',
  defaultStyles: linkTheme,
  theme
}));
const VizExLink = _ref => {
  let {
      use = DEFAULT,
      tabIndex = 0,
      as,
      onPress
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const ref = useRef(null);
  const {
    linkProps
  } = useLink({
    elementType: as,
    onPress
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  ref);
  return /*#__PURE__*/_jsx(StyledATag, Object.assign({
    as: as,
    ref: ref,
    use: use,
    tabIndex: tabIndex
  }, mergeProps(linkProps, rest)));
};
VizExLink.displayName = 'VizExLink';
export default VizExLink;