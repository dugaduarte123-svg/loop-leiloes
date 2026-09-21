import { createContext, useContext, useState } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const KBSearchContext = /*#__PURE__*/createContext(undefined);
export const KBSearchProvider = ({
  children
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  return /*#__PURE__*/_jsx(KBSearchContext.Provider, {
    value: {
      searchTerm,
      setSearchTerm
    },
    children: children
  });
};
KBSearchProvider.displayName = 'KBSearchProvider';
export const useKBSearch = () => {
  const context = useContext(KBSearchContext);
  if (!context) {
    return {
      searchTerm: '',
      setSearchTerm: () => {}
    };
  }
  return context;
};