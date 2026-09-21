import { useState } from 'react';
import styled from 'styled-components';
import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { getOptionLabel, getOptionValue
// @ts-ignore dependency missing types
} from 'conversations-message-history/quick-reply/operators/quickReplyGetters';
import QuickReplyButton from 'conversations-visitor-message-history/quick-reply/QuickReplyButton';
import QuickReplySelect from 'conversations-visitor-message-history/quick-reply/QuickReplySelect';
import { MAX_QUICK_REPLY_BUTTONS } from 'conversations-visitor-message-history/quick-reply/constants/quickReplies';
import VizExButton from 'visitor-ui-component-library/button/VizExButton';
import { createThemeV2 } from 'visitor-ui-component-library/theme/createThemeV2';
import { OBSIDIAN } from 'visitor-ui-component-library/constants/WidgetColors';
import { getCanReadTextOnce } from 'visitor-ui-component-library/utils/colors';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const QuickRepliesContainer = styled.div.withConfig({
  displayName: "WelcomeMessageQuickReplies__QuickRepliesContainer"
})(["display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;width:100%;justify-content:center;"]);
const QuickReplySelectContainer = styled.div.withConfig({
  displayName: "WelcomeMessageQuickReplies__QuickReplySelectContainer"
})(["display:flex;flex-direction:column;align-items:center;width:100%;margin-top:10px;"]);
const QuickReplySelectSendButton = styled(VizExButton).withConfig({
  displayName: "WelcomeMessageQuickReplies__QuickReplySelectSendButton"
})(["margin-top:8px;"]);
const WelcomeMessageQuickReplies = ({
  quickReplyOptions = ImmutableOrderedSet(),
  onQuickReplyClick,
  accentColor
}) => {
  const [selectedQuickReply, setSelectedQuickReply] = useState(ImmutableMap());
  const handleButtonClick = (option, event) => {
    event.stopPropagation();
    const text = getOptionLabel(option);
    onQuickReplyClick(text, option);
  };
  const handleSelectChange = event => {
    event.stopPropagation();
    const {
      value
    } = event.target;
    const newSelectedOption = quickReplyOptions.filter(option => getOptionValue(option) === value).first();
    setSelectedQuickReply(newSelectedOption);
  };
  const handleSelectSubmit = event => {
    event.stopPropagation();
    if (!selectedQuickReply.isEmpty()) {
      const text = getOptionLabel(selectedQuickReply);
      onQuickReplyClick(text, selectedQuickReply);
    }
  };
  const isTextReadable = accentColor ? getCanReadTextOnce(accentColor) : false;
  const primaryColor = isTextReadable ? accentColor : OBSIDIAN;
  const hasQuickRepliesFromOptions = quickReplyOptions.size > 0;
  if (!hasQuickRepliesFromOptions) {
    return null;
  }
  if (quickReplyOptions.size <= MAX_QUICK_REPLY_BUTTONS) {
    return /*#__PURE__*/_jsx(QuickRepliesContainer, {
      "data-test-id": "welcome-message-quick-replies",
      children: quickReplyOptions.map(option => {
        const value = getOptionValue(option);
        const label = getOptionLabel(option);
        if (!value || !label) {
          return null;
        }
        return /*#__PURE__*/_jsx(QuickReplyButton, {
          onClick: e => handleButtonClick(option, e),
          accentColor: accentColor,
          "data-test-id": `quick-reply-button-${value}`,
          children: label
        }, `quick-reply-button-${value}`);
      })
    });
  }
  return /*#__PURE__*/_jsxs(QuickReplySelectContainer, {
    "data-test-id": "welcome-message-quick-replies-select",
    onClick: e => e.stopPropagation(),
    children: [/*#__PURE__*/_jsx(QuickReplySelect, {
      disabled: false,
      quickReplyOptions: quickReplyOptions,
      onChange: handleSelectChange,
      value: getOptionValue(selectedQuickReply),
      placeholder: I18n.text('conversations-visitor-experience-components.quickReply.selectionPlaceholder'),
      theme: createThemeV2({
        colors: {
          primary: primaryColor
        }
      })
    }), !selectedQuickReply.isEmpty() && /*#__PURE__*/_jsx(QuickReplySelectSendButton, {
      use: "primary",
      onClick: handleSelectSubmit,
      theme: createThemeV2({
        colors: {
          primary: primaryColor
        }
      }),
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "conversations-visitor-experience-components.quickReply.selectionComplete"
      })
    })]
  });
};
WelcomeMessageQuickReplies.displayName = 'WelcomeMessageQuickReplies';
export default WelcomeMessageQuickReplies;