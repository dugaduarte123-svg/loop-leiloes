import { cloneElement, Children } from 'react';
import { useMenuContext } from './VizExMenu';
import { OPEN, TOGGLE } from './VizExMenuConstants';
const VizExMenuTrigger = ({
  children,
  mode = OPEN
}) => {
  const {
    isOpen,
    open,
    close,
    triggerRef
  } = useMenuContext();
  return /*#__PURE__*/cloneElement(Children.only(children), {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    onClick: e => {
      var _children$props$onCli, _children$props;
      (_children$props$onCli = (_children$props = children.props).onClick) === null || _children$props$onCli === void 0 || _children$props$onCli.call(_children$props, e);
      if (mode === TOGGLE && isOpen) {
        close();
      } else {
        open();
      }
    }
  });
};
VizExMenuTrigger.displayName = 'VizExMenuTrigger';
export default VizExMenuTrigger;