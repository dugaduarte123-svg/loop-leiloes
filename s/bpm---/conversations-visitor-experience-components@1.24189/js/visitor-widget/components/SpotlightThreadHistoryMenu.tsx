import styled from 'styled-components';
import I18n from 'I18n';
import SVGEdit from 'visitor-ui-component-library-icons/icons/SVGEdit';
import { WHITE, NEUTRAL_400, NEUTRAL_1600 } from 'visitor-ui-component-library/constants/WidgetColors';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import VizExMenu from 'visitor-ui-component-library/menu/VizExMenu';
import VizExMenuTrigger from 'visitor-ui-component-library/menu/VizExMenuTrigger';
import VizExMenuContent from 'visitor-ui-component-library/menu/VizExMenuContent';
import VizExMenuItem from 'visitor-ui-component-library/menu/VizExMenuItem';
import VizExMenuSectionLabel from 'visitor-ui-component-library/menu/VizExMenuSectionLabel';
import VizExMenuSeparator from 'visitor-ui-component-library/menu/VizExMenuSeparator';
import { TOGGLE } from 'visitor-ui-component-library/menu/VizExMenuConstants';
import SpotlightThreadHistoryEmptyState from './SpotlightThreadHistoryEmptyState';
import SpotlightThreadHistoryItem from './SpotlightThreadHistoryItem';
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const TriggerButton = styled.button.withConfig({
  displayName: "SpotlightThreadHistoryMenu__TriggerButton"
})(["display:flex;align-items:center;gap:8px;background:transparent;border:none;border-radius:9999px;padding:4px 8px 4px 8px;cursor:pointer;text-align:left;transition:background-color 150ms ease-out;&:hover{background-color:rgba(0,0,0,0.06);}", ""], getFocusRingStyles({
  ringColor: NEUTRAL_1600
}));
const HistoryPopover = styled.div.withConfig({
  displayName: "SpotlightThreadHistoryMenu__HistoryPopover"
})(["margin-top:4px;background-color:", ";border-radius:16px;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.06);border:1px solid ", ";min-width:280px;max-width:416px;overflow:hidden;padding:8px 0;"], WHITE, NEUTRAL_400);
const ThreadListArea = styled.div.withConfig({
  displayName: "SpotlightThreadHistoryMenu__ThreadListArea"
})(["max-height:300px;overflow-y:auto;"]);
const NewChatIcon = styled.span.withConfig({
  displayName: "SpotlightThreadHistoryMenu__NewChatIcon"
})(["display:flex;align-items:center;justify-content:center;flex-shrink:0;width:16px;height:16px;color:", ";"], NEUTRAL_1600);
const SpotlightThreadHistoryMenu = ({
  currentThreadId,
  threads,
  onSelectThread,
  onNewChat,
  triggerContent
}) => {
  const previousThreads = threads.filter(thread => thread.threadId !== currentThreadId);
  return /*#__PURE__*/_jsxs(VizExMenu, {
    children: [/*#__PURE__*/_jsx(VizExMenuTrigger, {
      mode: TOGGLE,
      children: /*#__PURE__*/_jsx(TriggerButton, {
        "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.spotlightViewHistory'),
        "data-test-id": "spotlight-thread-history-trigger",
        children: triggerContent
      })
    }), /*#__PURE__*/_jsx(VizExMenuContent, {
      "aria-label": I18n.text('conversations-visitor-experience-components.spotlightThreadHistory.menuLabel'),
      "data-test-id": "spotlight-thread-history-popover",
      children: /*#__PURE__*/_jsxs(HistoryPopover, {
        children: [previousThreads.length > 0 ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(VizExMenuSectionLabel, {
            children: I18n.text('conversations-visitor-experience-components.spotlightThreadHistory.previousThreads')
          }), /*#__PURE__*/_jsx(ThreadListArea, {
            children: previousThreads.map(thread => /*#__PURE__*/_jsx(SpotlightThreadHistoryItem, {
              hasAttachment: thread.hasAttachment,
              previewText: thread.previewText,
              formattedTimestamp: thread.formattedTimestamp,
              unseenCount: thread.unseenCount,
              onClick: () => onSelectThread(thread.threadId)
            }, thread.threadId))
          })]
        }) : /*#__PURE__*/_jsx(SpotlightThreadHistoryEmptyState, {}), /*#__PURE__*/_jsx(VizExMenuSeparator, {
          inset: 20
        }), /*#__PURE__*/_jsxs(VizExMenuItem, {
          onClick: onNewChat,
          "data-test-id": "spotlight-thread-history-new-chat",
          children: [/*#__PURE__*/_jsx(NewChatIcon, {
            children: /*#__PURE__*/_jsx(SVGEdit, {
              width: 16,
              height: 16,
              "aria-hidden": "true"
            })
          }), I18n.text('conversations-visitor-experience-components.spotlightThreadHistory.newChat')]
        })]
      })
    })]
  });
};
SpotlightThreadHistoryMenu.displayName = 'SpotlightThreadHistoryMenu';
export default SpotlightThreadHistoryMenu;