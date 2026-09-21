import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["onPointerDown", "onMouseDown"];
export const filterReactAriaFocusProps = props => {
  const filtered = _objectWithoutPropertiesLoose(props, _excluded);
  return filtered;
};