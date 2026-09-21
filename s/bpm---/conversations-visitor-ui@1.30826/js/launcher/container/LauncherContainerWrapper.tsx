import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["useSpotlightLauncher"];
import { useSelector } from 'react-redux';
// @ts-ignore not typed
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import { getColoring } from '../../selectors/widgetDataSelectors/getColoring';
import { getIsOpen } from '../../selectors/getIsOpen';
import { getShowLauncherBadge } from '../../visitor-widget/selectors/getShowLauncherBadge';
import { getIsResponderAI } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getWidgetSize } from '../../widget-size/widgetSizeSelectors';
import { useContext } from 'react';
import { BrowserWindowContext } from '../../components/BrowserWindowContext';
import { getSendFrom } from '../../widget-data/selectors/getSendFrom';
import LauncherContainer from 'conversations-visitor-experience-components/visitor-widget/LauncherContainer';
import SpotlightLauncher from '../components/SpotlightLauncher';
import { jsx as _jsx } from "react/jsx-runtime";
const useComponent = () => {
  const {
    browserWindowWidth
  } = useContext(BrowserWindowContext);
  const badgeNumber = useSelector(calculateUnseenThreadsCount);
  const coloring = useSelector(getColoring);
  const open = useSelector(getIsOpen);
  const showBadge = useSelector(getShowLauncherBadge);
  const sendFromResponders = useSelector(getSendFrom);
  const widgetSize = useSelector(getWidgetSize);
  const isResponderAI = sendFromResponders.some(responder => Boolean(getIsResponderAI(responder)));
  return {
    badgeNumber,
    coloring,
    open,
    showBadge,
    isResponderAI,
    widgetSize,
    browserWindowWidth
  };
};
const LauncherContainerWrapper = _ref => {
  let {
      useSpotlightLauncher: isSpotlightLauncher
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const componentProps = useComponent();
  if (isSpotlightLauncher) {
    return /*#__PURE__*/_jsx(SpotlightLauncher, {
      onOpen: props.onOpen,
      onClose: props.onClose,
      open: componentProps.open,
      browserWindowWidth: componentProps.browserWindowWidth
    });
  }
  return /*#__PURE__*/_jsx(LauncherContainer, Object.assign({}, props, componentProps));
};
LauncherContainerWrapper.displayName = 'LauncherContainerWrapper';
export default LauncherContainerWrapper;