import { useMemo } from 'react';
import { getOptionValue, getOptionLabel
// @ts-ignore Untyped import
} from 'conversations-message-history/quick-reply/operators/quickReplyGetters';
import VizExMobileSelect from 'visitor-ui-component-library/select/VizExMobileSelect';
import { createThemeV2 } from 'visitor-ui-component-library/theme/createThemeV2';
import { jsx as _jsx } from "react/jsx-runtime";
const QuickReplySelect = ({
  quickReplyOptions,
  onChange,
  disabled,
  value,
  placeholder,
  theme = createThemeV2()
}) => {
  const options = useMemo(() => quickReplyOptions.map(option => {
    const optionValue = getOptionValue(option);
    const text = getOptionLabel(option);
    return {
      text,
      value: optionValue
    };
  }).toJS(), [quickReplyOptions]);
  return /*#__PURE__*/_jsx(VizExMobileSelect, {
    options: options,
    onChange: onChange,
    disabled: disabled,
    value: value,
    placeholder: placeholder,
    theme: theme
  });
};
QuickReplySelect.displayName = 'QuickReplySelect';
export default QuickReplySelect;