import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { RIGHT_ALIGNED } from 'conversations-internal-schema/widget-location/constants/WidgetLocations';
import { WHITE, NEUTRAL_800, NEUTRAL_900, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { promptButtonCoreStyles, promptButtonFixedWidthStyles, promptButtonFlexibleWidthStyles } from 'conversations-visitor-message-history/shared/components/BasePromptButton';
import { jsx as _jsx } from "react/jsx-runtime";
const MAX_INITIAL_PROMPTS = 3;
const FADE_IN = 'fadeIn';
const FADE_OUT = 'fadeOut';
const ANIMATION_DURATION = 700;
const AIPromptRecommendationsContainer = styled.div.withConfig({
  displayName: "AIPromptRecommendations__AIPromptRecommendationsContainer"
})(["display:flex;justify-content:", ";@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}@keyframes fadeOut{from{opacity:1;}to{opacity:0;}}animation-name:", ";animation-duration:", "ms;animation-timing-function:", ";"], props => props.widgetLocation === RIGHT_ALIGNED ? 'end' : 'start', ({
  isVisible
}) => isVisible ? FADE_IN : FADE_OUT, ANIMATION_DURATION, ({
  isVisible
}) => isVisible ? 'ease-in' : 'ease-out');
const PromptsWrapper = styled.div.withConfig({
  displayName: "AIPromptRecommendations__PromptsWrapper"
})(["display:flex;flex-direction:column;gap:6px;align-items:", ";"], ({
  widgetLocation
}) => widgetLocation === RIGHT_ALIGNED ? 'flex-end' : 'flex-start');
export const AIPromptButton = styled.button.withConfig({
  displayName: "AIPromptRecommendations__AIPromptButton"
})(["", " ", " background:", ";color:", ";border:1px solid ", ";&:hover{color:", ";border-color:", ";}"], promptButtonCoreStyles, ({
  insideChat
}) => insideChat ? promptButtonFlexibleWidthStyles : promptButtonFixedWidthStyles, WHITE, NEUTRAL_1600, NEUTRAL_800, ({
  coloring
}) => (coloring === null || coloring === void 0 ? void 0 : coloring.useDefaultColor) === false ? coloring === null || coloring === void 0 ? void 0 : coloring.accentColor : NEUTRAL_900, ({
  coloring
}) => (coloring === null || coloring === void 0 ? void 0 : coloring.useDefaultColor) === false ? coloring === null || coloring === void 0 ? void 0 : coloring.accentColor : NEUTRAL_900);
export const AIPromptRecommendations = ({
  recommendedQuestionsForAgent = [],
  widgetLocation = RIGHT_ALIGNED,
  coloring,
  insideChat = false,
  onPromptClick,
  onPromptTrack,
  shouldShow = false
}) => {
  const [shouldMount, setShouldMount] = useState(false);
  const getWhitespaceCount = str => {
    return (str.match(/\s/g) || []).length;
  };
  const visiblePrompts = useMemo(() => Array.isArray(recommendedQuestionsForAgent) ? recommendedQuestionsForAgent.slice(0, MAX_INITIAL_PROMPTS).sort((a, b) => {
    if (a.length === b.length) {
      return getWhitespaceCount(a) - getWhitespaceCount(b);
    }
    return a.length - b.length;
  }) : [], [recommendedQuestionsForAgent]);
  const isVisible = shouldShow && visiblePrompts.length > 0;
  useEffect(() => {
    if (isVisible) {
      setShouldMount(true);
    }
  }, [isVisible]);
  if (!shouldMount) {
    return null;
  }
  const handlePromptClick = promptText => {
    onPromptClick(promptText);
    onPromptTrack === null || onPromptTrack === void 0 || onPromptTrack();
  };
  return /*#__PURE__*/_jsx(AIPromptRecommendationsContainer, {
    widgetLocation: widgetLocation,
    onAnimationEnd: e => {
      if (e.animationName === FADE_OUT) {
        setShouldMount(false);
      }
    },
    isVisible: isVisible,
    children: /*#__PURE__*/_jsx(PromptsWrapper, {
      widgetLocation: widgetLocation,
      "data-test-id": "ai-prompt-recommendations",
      children: visiblePrompts.map((prompt, index) => /*#__PURE__*/_jsx(AIPromptButton, {
        onClick: () => handlePromptClick(prompt),
        "data-test-id": `ai-prompt-recommendation-${index}`,
        coloring: coloring,
        insideChat: insideChat,
        children: prompt
      }, `ai-prompt-${prompt}`))
    })
  });
};
AIPromptRecommendations.displayName = 'AIPromptRecommendations';