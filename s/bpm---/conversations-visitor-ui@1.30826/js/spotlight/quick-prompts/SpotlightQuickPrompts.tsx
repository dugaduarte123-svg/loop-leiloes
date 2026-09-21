import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NEUTRAL_1000, NEUTRAL_400 } from 'visitor-ui-component-library/constants/WidgetColors';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import { spotlightTheme } from 'conversations-visitor-experience-components/visitor-widget/spotlight/theme';
import I18n from 'I18n';
import { setHasClickedWelcomePagePrompts } from '../../ai-prompt-recommendations/reducers/aiPromptsInteractionSlice';
import { getHasClickedWelcomePagePrompts } from '../../ai-prompt-recommendations/selectors/getHasClickedWelcomePagePrompts';
import { hasPersistedThreads } from '../../threads/selectors/hasPersistedThreads';
import { getIsOpen } from '../../selectors/getIsOpen';
import { useAppDispatch } from '../../buildStore';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { EVENT_NAMES } from '../../usage-tracking/constants/eventNames';
import { jsx as _jsx } from "react/jsx-runtime";
const ANIMATION_DURATION = 400;

// TODO: Replace with data from redux store / API
const HARDCODED_PROMPTS = ['What can HubSpot do for me?', 'Tell me about sales automation', 'I want to see a demo of HubSpot?'];
const PromptsContainer = styled.div.withConfig({
  displayName: "SpotlightQuickPrompts__PromptsContainer"
})(["display:flex;flex-direction:column;gap:10px;align-items:flex-start;margin-bottom:", ";opacity:", ";transform:", ";transition:opacity ", "ms cubic-bezier(0.4,0,0.2,1),transform ", "ms cubic-bezier(0.4,0,0.2,1);"], spotlightTheme.spacing.md, ({
  $isVisible
}) => $isVisible ? 1 : 0, ({
  $isVisible
}) => $isVisible ? 'translateY(0)' : 'translateY(8px)', ANIMATION_DURATION, ANIMATION_DURATION);
const PromptPill = styled.button.withConfig({
  displayName: "SpotlightQuickPrompts__PromptPill"
})(["background:", ";color:", ";border:none;border-radius:", ";padding:", " ", ";font-size:", ";font-weight:", ";line-height:", ";text-align:left;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.1);word-break:break-word;max-width:360px;box-sizing:border-box;transition:box-shadow 0.15s ease,background-color 0.15s ease;&:hover{box-shadow:0 2px 8px rgba(0,0,0,0.15);background-color:", ";}&:active{background-color:", ";}", ""], spotlightTheme.color.surface, NEUTRAL_1000, spotlightTheme.spacing.xxl, spotlightTheme.spacing.md, spotlightTheme.spacing.xl, ({
  theme
}) => theme.spotlight.typography.fontSize.xl, ({
  theme
}) => theme.spotlight.typography.fontWeight.regular, ({
  theme
}) => theme.spotlight.typography.lineHeight.lg, NEUTRAL_400, NEUTRAL_400, getFocusRingStyles({
  outlineOffset: '2px'
}));
const SpotlightQuickPrompts = ({
  onSubmit,
  isInputFocused,
  menuOpen
}) => {
  const dispatch = useAppDispatch();
  const isOpen = useSelector(getIsOpen);
  const hasClickedPrompts = useSelector(getHasClickedWelcomePagePrompts);
  const hasExistingThreads = useSelector(hasPersistedThreads);
  const [isAnimating, setIsAnimating] = useState(false);
  const shouldMount = (isInputFocused || menuOpen) && !isOpen && !hasClickedPrompts && !hasExistingThreads;
  const isVisible = shouldMount && !menuOpen;
  useEffect(() => {
    if (isVisible) {
      const frameId = requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      setIsAnimating(false);
      return undefined;
    }
  }, [isVisible]);
  if (!shouldMount) {
    return null;
  }
  const onPillClick = text => {
    dispatch(trackInteraction(EVENT_NAMES.WIDGET_INTERACTION, {
      action: 'clicked spotlight quick prompt',
      value: text
    }));
    dispatch(setHasClickedWelcomePagePrompts({
      hasClicked: true
    }));
    onSubmit(text);
  };
  return /*#__PURE__*/_jsx(PromptsContainer, {
    $isVisible: isAnimating,
    role: "group",
    "aria-label": I18n.text('conversations-visitor-ui.spotlightQuickPrompts.ariaLabel'),
    "data-test-id": "spotlight-quick-prompts",
    children: HARDCODED_PROMPTS.map((prompt, index) => /*#__PURE__*/_jsx(PromptPill, {
      onMouseDown: e => e.preventDefault(),
      onClick: () => onPillClick(prompt),
      "data-test-id": `spotlight-prompt-${index}`,
      children: prompt
    }, prompt))
  });
};
SpotlightQuickPrompts.displayName = 'SpotlightQuickPrompts';
export default SpotlightQuickPrompts;