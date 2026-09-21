import { useContext, useRef } from 'react';
import useNavMarker from './useNavMarker';
import useNavMarkerVisibility from './useNavMarkerVisibility';
import RhumbContext from './internal/RhumbContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const NavMarkerImpl = ({
  name
}) => {
  const ref = useRef(null);
  const context = useContext(RhumbContext);
  useNavMarker(name);
  useNavMarkerVisibility(name, ref);
  if (context && context.trackVisibility) {
    return /*#__PURE__*/_jsx("div", {
      "aria-hidden": true,
      ref: ref
    });
  }
  return null;
};
const NavMarker = ({
  children,
  name
}) => /*#__PURE__*/_jsxs(_Fragment, {
  children: [/*#__PURE__*/_jsx(NavMarkerImpl, {
    name: name
  }), children]
});
export default NavMarker;