import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["browserWindowHeight", "browserWindowWidth", "children", "className", "inline", "isSpotlight", "showCloseButton", "size", "style", "mobile", "widgetLocation", "forwardedRef", "widgetSize"];
import classNames from 'classnames';
import WidgetModal from 'conversations-visitor-message-history/widget-modal/WidgetModal';
import { WidgetModalProvider, useWidgetModalOrContext } from 'conversations-visitor-message-history/widget-modal/WidgetModalContext';
import styled, { css } from 'styled-components';
import { WHITE } from 'visitor-ui-component-library/constants/WidgetColors';
import { RIGHT_ALIGNED } from '../visitor-widget/constants/WidgetLocations';
import { calculateChatWidgetWidth } from '../widget-dimensions/calculateChatWidgetWidth';
import { SPOTLIGHT_WIDGET_BORDER_RADIUS, UPDATED_VISITOR_WIDGET_BORDER_RADIUS } from '../widget-dimensions/constants/dimensions';
import { getWidgetHeight } from '../widget-dimensions/getWidgetHeight';
import { useWidgetResizeContext } from '../contexts/WidgetResizeContext';
import WidgetResizeHandle from './WidgetResizeHandle';
import { useDetachedWindow } from '../contexts/DetachedWindowContext';
import { useSpotlightLayout } from '../contexts/SpotlightLayoutContext';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
const sizes = {
  small: 'small',
  'extra-small': 'extra-small',
  default: 'default'
};
export const WidgetStyleWrapper = styled.div.withConfig({
  displayName: "VisitorWidgetStyleWrapper__WidgetStyleWrapper"
})(["display:flex;flex-direction:column;align-items:flex-end;", " transform-origin:bottom right;"], ({
  inline,
  mobile,
  size,
  isDetached
}) => css(["height:", ";width:", ";", " margin-top:", ";transform:", ";"], (inline || mobile) && '100%', mobile && '100%', isDetached && css(["height:100vh;width:100%;"]), inline && '0', size === sizes.small ? 'scale(0.75)' : size === sizes['extra-small'] ? 'scale(0.5)' : undefined));
export const WidgetContentStyleWrapper = styled.div.withConfig({
  displayName: "VisitorWidgetStyleWrapper__WidgetContentStyleWrapper"
})(["height:", ";display:flex;flex-direction:column;background:", ";overflow:hidden;border-radius:", ";box-shadow:", ";position:relative;container-type:inline-size;container-name:chat-widget;width:", ";transition:", ";&.inline{box-shadow:none;height:100%;margin:0;width:100%;border-radius:0;}"], props => getWidgetHeight({
  isDetached: props.isDetached,
  mobile: props.mobile,
  browserWindowHeight: props.browserWindowHeight,
  widgetSize: props.widgetSize,
  showCloseButton: props.showCloseButton,
  spotlightLauncherHeight: props.$isSpotlight ? props.$spotlightLauncherHeight : undefined
}), WHITE, ({
  $isSpotlight
}) => $isSpotlight ? `${SPOTLIGHT_WIDGET_BORDER_RADIUS}px` : `${UPDATED_VISITOR_WIDGET_BORDER_RADIUS}px`, ({
  $isSpotlight
}) => $isSpotlight ? '0 4px 24px rgba(0, 0, 0, 0.10), 0 1px 6px rgba(0, 0, 0, 0.06)' : '0 4px 16px rgba(0, 0, 0, 0.1)', ({
  widgetSize,
  browserWindowWidth,
  isDetached
}) => isDetached ? '100%' : `var(--widget-width, ${calculateChatWidgetWidth(browserWindowWidth || 562, widgetSize.width || 530)}px)`, ({
  $isResizing
}) => $isResizing ? 'none' : 'all 0.25s ease-in-out');
export const WIDGET_CONTENT_STYLE_WRAPPER_TEST_ID = 'chat-widget-wrapper';
const VisitorWidgetStyleWrapperContent = props => {
  const {
      browserWindowHeight,
      browserWindowWidth,
      children,
      className,
      inline = false,
      isSpotlight = false,
      showCloseButton = true,
      size = sizes.default,
      style,
      mobile,
      widgetLocation = RIGHT_ALIGNED,
      forwardedRef,
      widgetSize = {
        width: 376,
        height: 530
      }
    } = props,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    isDetached
  } = useDetachedWindow();
  const {
    launcherHeight: spotlightLauncherHeight
  } = useSpotlightLayout();
  const {
    isOpen,
    closeModal,
    modalContent
  } = useWidgetModalOrContext();
  const {
    isResizing
  } = useWidgetResizeContext();
  return /*#__PURE__*/_jsx(_Fragment, {
    children: /*#__PURE__*/_jsx(WidgetStyleWrapper, {
      style: style,
      inline: inline,
      size: size,
      mobile: !!mobile,
      isDetached: isDetached,
      "data-test-id": "widget-style-wrapper",
      children: /*#__PURE__*/_jsxs(WidgetContentStyleWrapper, Object.assign({
        browserWindowWidth: browserWindowWidth,
        className: classNames('chat-widget', className, mobile && "mobile", inline && "inline"),
        "data-test-id": WIDGET_CONTENT_STYLE_WRAPPER_TEST_ID,
        widgetSize: widgetSize,
        browserWindowHeight: browserWindowHeight,
        widgetLocation: widgetLocation,
        mobile: !!mobile,
        showCloseButton: !!showCloseButton,
        $isResizing: isResizing,
        $isSpotlight: isSpotlight,
        $spotlightLauncherHeight: isSpotlight ? spotlightLauncherHeight : undefined,
        isDetached: isDetached,
        ref: forwardedRef
      }, rest, {
        children: [children, /*#__PURE__*/_jsx(WidgetResizeHandle, {}), /*#__PURE__*/_jsx(WidgetModal, {
          isOpen: isOpen,
          onClose: closeModal,
          modalContent: modalContent
        })]
      }))
    })
  });
};
VisitorWidgetStyleWrapperContent.displayName = 'VisitorWidgetStyleWrapperContent';
const VisitorWidgetStyleWrapper = props => {
  return /*#__PURE__*/_jsx(WidgetModalProvider, {
    children: /*#__PURE__*/_jsx(VisitorWidgetStyleWrapperContent, Object.assign({}, props))
  });
};
VisitorWidgetStyleWrapper.displayName = 'VisitorWidgetStyleWrapper';
export default VisitorWidgetStyleWrapper;