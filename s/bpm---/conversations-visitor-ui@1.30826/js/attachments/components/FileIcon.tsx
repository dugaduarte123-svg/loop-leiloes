import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["type"];
import SVGFile from 'visitor-ui-component-library-icons/icons/SVGFile';
import SVGPdfFile from 'visitor-ui-component-library-icons/icons/SVGPdfFile';
import SVGVideoFile from 'visitor-ui-component-library-icons/icons/SVGVideoFile';
import SVGDocFile from 'visitor-ui-component-library-icons/icons/SVGDocFile';
import { jsx as _jsx } from "react/jsx-runtime";
export default function FileIcon(_ref) {
  let {
      type
    } = _ref,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  const isPdf = type === 'application/pdf';
  const isVideo = type.startsWith('video/');
  const isDoc = type.startsWith('application/msword') || type.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  if (isPdf) {
    return /*#__PURE__*/_jsx(SVGPdfFile, Object.assign({}, props));
  }
  if (isVideo) {
    return /*#__PURE__*/_jsx(SVGVideoFile, Object.assign({}, props));
  }
  if (isDoc) {
    return /*#__PURE__*/_jsx(SVGDocFile, Object.assign({}, props));
  }
  return /*#__PURE__*/_jsx(SVGFile, {});
}
FileIcon.displayName = 'FileIcon';