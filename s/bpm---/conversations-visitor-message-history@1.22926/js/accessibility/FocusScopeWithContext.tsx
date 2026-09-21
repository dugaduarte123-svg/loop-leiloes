import { FocusScope } from '@react-aria/focus';
import { useAccessibilityContext } from './AccessibilityContext';
import { jsx as _jsx } from "react/jsx-runtime";
const FocusScopeWithContext = props => {
  const {
    disableAutoFocus
  } = useAccessibilityContext();
  return /*#__PURE__*/_jsx(FocusScope, Object.assign({
    contain: false
  }, props, {
    autoFocus: !disableAutoFocus
  }));
};
FocusScopeWithContext.displayName = 'FocusScopeWithContext';
export default FocusScopeWithContext;