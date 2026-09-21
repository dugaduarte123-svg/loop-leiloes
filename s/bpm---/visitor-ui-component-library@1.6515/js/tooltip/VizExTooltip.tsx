import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["placement", "delay", "content", "backgroundColor", "textColor", "children", "theme", "onOpenChange", "open", "contentStyle", "arrowStyle", "fullWidth"];
import { cloneElement, Children, useRef, isValidElement } from 'react';
import styled from 'styled-components';
import VizExTooltipArrow from './VizExTooltipArrow';
import VizExTooltipBody from './VizExTooltipBody';
import { callIfValid } from '../utils/callIfValid';
import { filterReactAriaFocusProps } from '../utils/filterReactAriaFocusProps';
import { useTooltipTriggerState } from '@react-stately/tooltip';
import { useTooltipTrigger } from '@react-aria/tooltip';
import { useKeyboard } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
const Popover = styled.div.withConfig({
  displayName: "VizExTooltip__Popover"
})(["transition-property:", ";transition-duration:", "ms;opacity:", ";transform:", ";position:absolute;pointer-events:none;width:100%;height:100%;"], ({
  transitioning
}) => transitioning ? 'opacity ease-out, transform ease-out' : 'none', ({
  duration
}) => duration, ({
  open
}) => open ? '1' : '0', ({
  open,
  transitioning
}) => {
  if (open && !transitioning) return 'none'; /* IE bugfix: #5368 */
  return open ? 'scale(1)' : 'scale(.75)';
});
const PopoverWrapper = styled.div.withConfig({
  displayName: "VizExTooltip__PopoverWrapper"
})(["display:", ";position:relative;"], ({
  $fullWidth
}) => $fullWidth ? 'block' : 'inline-block');
const VizExTooltip = _ref => {
  let {
      placement = 'top right',
      delay = 0,
      content,
      backgroundColor,
      textColor,
      children,
      theme,
      onOpenChange,
      open,
      contentStyle,
      arrowStyle,
      fullWidth
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const hasValidOpenProp = typeof open === 'boolean';
  const tooltipTriggerProps = Object.assign({
    delay
  }, hasValidOpenProp && {
    isOpen: open
  });
  const triggerRef = useRef(null);
  const state = useTooltipTriggerState(tooltipTriggerProps);
  const {
    triggerProps,
    tooltipProps
  } = useTooltipTrigger(tooltipTriggerProps, state,
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  triggerRef);
  const filteredTriggerProps = filterReactAriaFocusProps(triggerProps);
  const {
    keyboardProps
  } = useKeyboard({
    onKeyUp: filteredTriggerProps.onKeyUp,
    onKeyDown: filteredTriggerProps.onKeyDown
  });
  if (! /*#__PURE__*/isValidElement(children)) {
    return null;
  }
  if (!content) return children;
  const handleMouseEnter = () => {
    if (!hasValidOpenProp) {
      callIfValid(onOpenChange, true);
      state.open(true);
    }
  };
  const handleMouseLeave = () => {
    if (!hasValidOpenProp) {
      callIfValid(onOpenChange, false);
      state.close(true);
    }
  };
  return /*#__PURE__*/_jsxs(PopoverWrapper, Object.assign({}, rest, {
    $fullWidth: fullWidth,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children: [/*#__PURE__*/_jsxs(Popover, {
      open: state.isOpen,
      duration: 250,
      transitioning: true,
      "data-test-id": "tooltip-popover",
      children: [/*#__PURE__*/_jsx(VizExTooltipBody, Object.assign({
        textColor: textColor,
        backgroundColor: backgroundColor,
        placement: placement,
        open: state.isOpen,
        theme: theme,
        "data-test-open": state.isOpen
      }, tooltipProps, {
        "aria-hidden": true,
        style: contentStyle,
        children: content
      })), /*#__PURE__*/_jsx(VizExTooltipArrow, {
        backgroundColor: backgroundColor,
        placement: placement,
        theme: theme,
        style: arrowStyle
      })]
    }), /*#__PURE__*/cloneElement(Children.only(children), Object.assign({}, mergeProps(filteredTriggerProps, keyboardProps), {
      onClick: children.props.onClick,
      ref: triggerRef
    }))]
  }));
};
VizExTooltip.displayName = 'VizExTooltip';
export default VizExTooltip;