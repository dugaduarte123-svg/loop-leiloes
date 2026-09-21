import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGMessages from 'visitor-ui-component-library-icons/icons/SVGMessages';
import { jsx as _jsx } from "react/jsx-runtime";
const OpenIcon = ({
  height,
  width,
  color
}) => {
  return /*#__PURE__*/_jsx(VizExIcon, {
    icon: /*#__PURE__*/_jsx(SVGMessages, {
      height: height,
      width: width,
      fill: color
    })
  });
};
OpenIcon.displayName = 'OpenIcon';
export default OpenIcon;