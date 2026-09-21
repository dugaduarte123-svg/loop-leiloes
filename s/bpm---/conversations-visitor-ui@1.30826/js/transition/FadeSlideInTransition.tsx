import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["in", "children", "direction", "duration"];
import { CSSTransition } from 'react-transition-group';
import { useSelector } from 'react-redux';
import { getCurrentAnimation } from '../animation/selectors/getCurrentAnimation';
import { FADE, SCALE_FOLD } from '../animation/constants/constants';
import { jsx as _jsx } from "react/jsx-runtime";
export const getAnimationClassName = (animationType, direction) => {
  switch (animationType) {
    case FADE:
      return `fade-slide-transition-${direction}`;
    case SCALE_FOLD:
      return `scale-fold-transition-${direction}`;
    default:
      return `fade-slide-transition-${direction}`;
  }
};
const getTimeout = (animation, duration) => {
  if (animation === SCALE_FOLD) return 400;
  return duration;
};
const FadeSlideInTransition = _ref => {
  let {
      in: inProp,
      children,
      direction = 'bottom',
      duration = 500
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  const currentAnimation = useSelector(getCurrentAnimation);
  return /*#__PURE__*/_jsx(CSSTransition, Object.assign({
    in: inProp,
    timeout: getTimeout(currentAnimation, duration),
    classNames: getAnimationClassName(currentAnimation, direction),
    mountOnEnter: true,
    unmountOnExit: true,
    appear: true
  }, rest, {
    children: children
  }));
};
FadeSlideInTransition.displayName = 'FadeSlideInTransition';
export default FadeSlideInTransition;