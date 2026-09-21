import styled from 'styled-components';
import SearchInput from './SearchInput';
import { useKBSearch } from './context/KBSearchProvider';
import { jsx as _jsx } from "react/jsx-runtime";
const KBSearchWrapper = styled.div.withConfig({
  displayName: "KBSearchInput__KBSearchWrapper"
})(["margin-top:16px;width:100%;"]);
export default function KBSearchInput() {
  const {
    searchTerm,
    setSearchTerm
  } = useKBSearch();
  const handleInputChange = input => {
    setSearchTerm(input);
  };
  return /*#__PURE__*/_jsx(KBSearchWrapper, {
    children: /*#__PURE__*/_jsx(SearchInput, {
      value: searchTerm,
      onChange: handleInputChange
    })
  });
}
KBSearchInput.displayName = 'KBSearchInput';