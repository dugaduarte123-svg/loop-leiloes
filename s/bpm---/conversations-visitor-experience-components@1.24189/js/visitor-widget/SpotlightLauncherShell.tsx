import { useCallback, useEffect, useRef, useState } from 'react';
import { useButton } from 'react-aria';
import styled, { css, keyframes } from 'styled-components';
import { filterReactAriaFocusProps } from 'visitor-ui-component-library/utils/filterReactAriaFocusProps';
import { getFocusRingStyles } from 'visitor-ui-component-library/utils/getFocusRingStyles';
import LauncherContent, { MAX_TEXTAREA_HEIGHT } from './LauncherContent';
import { calculateSpotlightLauncherWidth } from '../widget-dimensions/calculateSpotlightLauncherWidth';
import { getNextMultiLineState } from './util/getNextMultiLineState';
import useOnOutsideMouseDown from '../hooks/useOnOutsideMouseDown';
import { useOpeningExpandedTransition } from './util/useOpeningExpandedTransition';
import { getValidationMessage } from './constants/getValidationMessage';
import { isMobileDevice } from './util/isMobileDevice';
import { getAskBarBorderColor } from './util/getAskBarBorderColor';
import { getGlowShadow, getGlowShadowDim } from './spotlight/theme';
import { jsx as _jsx } from "react/jsx-runtime";
export { IconButton } from './LauncherContent';
const TRANSITION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const SCALE_FOLD_EASING = 'cubic-bezier(0.86, 0, 0.07, 1)';
const expandIn = keyframes(["from{transform:scale(0.5,1);opacity:0;}to{transform:scale(1,1);opacity:1;}"]);
const pulseGlow = color => keyframes(["0%,100%{box-shadow:", ";}50%{box-shadow:", ";}"], getGlowShadowDim(color), getGlowShadow(color));
const Container = styled.div.withConfig({
  displayName: "SpotlightLauncherShell__Container"
})(["position:relative;border:1px solid ", ";border-radius:24px;box-shadow:", ";padding:10px 8px;display:flex;flex-direction:column;gap:8px;min-height:48px;width:", "px;background-color:white;cursor:", ";box-sizing:border-box;transform-origin:bottom center;", " transition:", ";outline:none;", ""], ({
  $showValidationMessage,
  $glowColor,
  $isFocused,
  theme
}) => getAskBarBorderColor({
  showValidationMessage: $showValidationMessage,
  glowColor: $glowColor,
  isFocused: $isFocused,
  theme
}), ({
  $glowColor,
  $isButton
}) => $glowColor ? $isButton ? getGlowShadow($glowColor) : getGlowShadowDim($glowColor) : '0 2px 12px rgba(0, 0, 0, 0.07)', ({
  $width
}) => $width, ({
  $disabled,
  $isButton
}) => $isButton ? 'pointer' : $disabled ? 'not-allowed' : 'text', ({
  $isOpeningExpanded,
  $glowColor,
  $isButton,
  $isMobile
}) => {
  if ($isOpeningExpanded) {
    return css(["animation:", " 400ms ", " forwards;"], expandIn, SCALE_FOLD_EASING);
  }
  if ($glowColor && $isButton && !$isMobile) {
    return css(["animation:", " 2.8s ease-in-out infinite;"], pulseGlow($glowColor));
  }
  return '';
}, ({
  $shouldAnimate
}) => $shouldAnimate ? `width 300ms ${TRANSITION_EASING}, box-shadow 200ms ease, border-color 150ms ease, border-radius 150ms ease` : 'box-shadow 200ms ease, border-color 150ms ease, border-radius 150ms ease', ({
  $isButton,
  $glowColor,
  theme
}) => $isButton && css(["&:hover{", "}", ""], !$glowColor && css(["box-shadow:", ";"], theme.spotlight.shadow.hover), getFocusRingStyles({
  outlineOffset: '3px'
})));
const SpotlightLauncherShell = ({
  placeholder,
  sendAriaLabel,
  onSubmit,
  onOpen,
  onClose,
  open = false,
  disabled = false,
  disableSubmit = false,
  hasAttachments = false,
  expanded = false,
  autoFocusInput = false,
  shouldAnimate = true,
  isButton = false,
  glowColor,
  buttonLabel,
  addMenu,
  fileUploads,
  browserWindowWidth,
  onExpandedChange,
  outsideClickBoundaryRef
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const {
    buttonProps
  } = useButton({
    onPress: onOpen,
    elementType: 'div',
    'aria-label': buttonLabel
  }, containerRef);
  const filteredButtonProps = filterReactAriaFocusProps(buttonProps);
  const [messageText, setMessageText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const isOpeningExpanded = useOpeningExpandedTransition(open, isMultiLine || hasAttachments);
  useEffect(() => {
    setHasLoaded(true);
  }, []);
  useEffect(() => {
    if (autoFocusInput) {
      var _inputRef$current;
      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 || _inputRef$current.focus();
    }
  }, [autoFocusInput]);
  useEffect(() => {
    if (!open) {
      setIsExpanded(false);
      onExpandedChange === null || onExpandedChange === void 0 || onExpandedChange(false);
    }
  }, [open, onExpandedChange]);
  useEffect(() => {
    if (open && !isButton && !disabled && !isMobileDevice()) {
      const id = requestAnimationFrame(() => {
        var _inputRef$current2;
        (_inputRef$current2 = inputRef.current) === null || _inputRef$current2 === void 0 || _inputRef$current2.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open, isButton, disabled]);
  const handleOutsideMouseDown = useCallback(() => {
    var _inputRef$current3;
    (_inputRef$current3 = inputRef.current) === null || _inputRef$current3 === void 0 || _inputRef$current3.blur();
    setIsExpanded(false);
    onExpandedChange === null || onExpandedChange === void 0 || onExpandedChange(false);
  }, [onExpandedChange]);
  useOnOutsideMouseDown(outsideClickBoundaryRef !== null && outsideClickBoundaryRef !== void 0 ? outsideClickBoundaryRef : containerRef, handleOutsideMouseDown, isExpanded);
  const validationMessage = getValidationMessage(messageText);
  const canSubmit = !disabled && !disableSubmit && !validationMessage;
  const hasTextContent = Boolean(messageText.trim());
  const isExpansionActive = open || isExpanded || expanded;
  const width = calculateSpotlightLauncherWidth(browserWindowWidth, isExpansionActive);
  const handleChange = e => {
    const {
      value,
      scrollHeight
    } = e.target;
    setMessageText(value);
    e.target.style.overflowY = scrollHeight >= MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
    setIsMultiLine(prev => getNextMultiLineState(prev, scrollHeight, value));
  };
  const handleSubmit = () => {
    const hasContent = hasTextContent || hasAttachments;
    if (!hasContent && !disabled) {
      onOpen();
      return;
    }
    if (!canSubmit || !hasContent) return;
    onSubmit(messageText);
    setMessageText('');
    setIsExpanded(false);
    setIsMultiLine(false);
    onExpandedChange === null || onExpandedChange === void 0 || onExpandedChange(false);
    if (inputRef.current) {
      inputRef.current.style.overflowY = 'hidden';
    }
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (open) {
        onClose === null || onClose === void 0 || onClose();
      } else {
        var _inputRef$current4;
        setIsExpanded(false);
        onExpandedChange === null || onExpandedChange === void 0 || onExpandedChange(false);
        (_inputRef$current4 = inputRef.current) === null || _inputRef$current4 === void 0 || _inputRef$current4.blur();
      }
    }
  };
  const handleFocus = () => {
    setIsExpanded(true);
    onExpandedChange === null || onExpandedChange === void 0 || onExpandedChange(true);
  };
  const handleBlur = e => {
    var _containerRef$current;
    if ((_containerRef$current = containerRef.current) !== null && _containerRef$current !== void 0 && _containerRef$current.contains(e.relatedTarget)) return;
    setIsExpanded(false);
    onExpandedChange === null || onExpandedChange === void 0 || onExpandedChange(false);
  };
  const handleContainerClick = () => {
    if (isButton) {
      onOpen();
      return;
    }
    if (!disabled) {
      var _inputRef$current5;
      (_inputRef$current5 = inputRef.current) === null || _inputRef$current5 === void 0 || _inputRef$current5.focus();
    }
  };
  return /*#__PURE__*/_jsx(Container, Object.assign({}, isButton ? filteredButtonProps : {}, {
    ref: containerRef,
    $width: width,
    $shouldAnimate: shouldAnimate && hasLoaded && !isOpeningExpanded,
    $disabled: disabled,
    $isButton: isButton,
    $isOpeningExpanded: isOpeningExpanded,
    $showValidationMessage: !isButton && Boolean(validationMessage),
    $glowColor: glowColor !== null && glowColor !== void 0 ? glowColor : null,
    $isFocused: isExpanded,
    $isMobile: isMobileDevice(),
    "data-test-id": "spotlight-launcher",
    onClick: handleContainerClick,
    children: /*#__PURE__*/_jsx(LauncherContent, {
      isButton: isButton,
      isMultiLine: isMultiLine,
      validationMessage: validationMessage,
      buttonLabel: buttonLabel,
      addMenu: addMenu,
      fileUploads: fileUploads,
      inputRef: inputRef,
      placeholder: placeholder,
      messageText: messageText,
      onKeyDown: handleKeyDown,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled: disabled,
      canSubmit: canSubmit,
      hasTextContent: hasTextContent,
      hasAttachments: hasAttachments,
      onSubmit: handleSubmit,
      sendAriaLabel: sendAriaLabel
    })
  }));
};
SpotlightLauncherShell.displayName = 'SpotlightLauncherShell';
export default SpotlightLauncherShell;