import WidgetWrapper from './WidgetWrapper';
import { jsx as _jsx } from "react/jsx-runtime";
const WidgetWrapperSelector = ({
  isOpen,
  mobile,
  inline,
  widgetLocation,
  children
}) => {
  return /*#__PURE__*/_jsx(WidgetWrapper, {
    isOpen: isOpen,
    mobile: mobile,
    inline: inline,
    widgetLocation: widgetLocation,
    children: children
  });
};
WidgetWrapperSelector.displayName = 'WidgetWrapperSelector';
export default WidgetWrapperSelector;