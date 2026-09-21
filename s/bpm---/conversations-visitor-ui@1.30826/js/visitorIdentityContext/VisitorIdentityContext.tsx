import { createContext, useContext, useState } from 'react';
import { getIsFirstVisitorSessionParam } from '../query-params/getIsFirstVisitorSessionParam';
import { jsx as _jsx } from "react/jsx-runtime";
export const throwErrorWhenContextUsedBeforeInstantiated = () => {
  throw new Error('visitorIdentity context was used before its value got instantiated');
};
export const defaultVisitorIdentityContext = {
  getIsFirstVisitorSession: throwErrorWhenContextUsedBeforeInstantiated,
  setIsFirstVisitorSession: throwErrorWhenContextUsedBeforeInstantiated,
  setIsPrivateWidgetLoad: throwErrorWhenContextUsedBeforeInstantiated,
  getIsPrivateWidgetLoad: throwErrorWhenContextUsedBeforeInstantiated
};
export const VisitorIdentityContext = /*#__PURE__*/createContext(defaultVisitorIdentityContext);
export const VisitorIdentityContextProvider = ({
  children
}) => {
  const [isFirstVisitorSession, setIsFirstVisitorSession] = useState(getIsFirstVisitorSessionParam());
  const [isPrivateWidgetLoad, setIsPrivateWidgetLoad] = useState(false);
  const getIsFirstVisitorSession = () => {
    if (isPrivateWidgetLoad) {
      return false;
    }
    return isFirstVisitorSession;
  };
  const getIsPrivateWidgetLoad = () => {
    return isPrivateWidgetLoad;
  };
  return /*#__PURE__*/_jsx(VisitorIdentityContext.Provider, {
    value: {
      getIsFirstVisitorSession,
      setIsFirstVisitorSession,
      setIsPrivateWidgetLoad,
      getIsPrivateWidgetLoad
    },
    children: children
  });
};
VisitorIdentityContextProvider.displayName = 'VisitorIdentityContextProvider';
export const ConsumeVisitorIdentityContext = TheComponent => {
  const TheComponentWithContext = props => {
    const visitorIdentity = useContext(VisitorIdentityContext);
    return /*#__PURE__*/_jsx(TheComponent, Object.assign({}, props, {
      visitorIdentity: visitorIdentity
    }));
  };
  TheComponentWithContext.displayName = `ConsumeVisitorIdentityContext(${TheComponent.displayName})`;
  return TheComponentWithContext;
};
ConsumeVisitorIdentityContext.displayName = 'ConsumeVisitorIdentityContext';