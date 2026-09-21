import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["imageFile"];
import { Component } from 'react';
import VizExImage from 'visitor-ui-component-library/image/VizExImage';
import { jsx as _jsx } from "react/jsx-runtime";
class ImageAttachmentPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageDataUrl: ''
    };
  }
  componentDidMount() {
    this.processImageFile(this.props.imageFile);
  }
  componentDidUpdate(prevProps) {
    if (this.props.imageFile !== prevProps.imageFile) {
      this.processImageFile(this.props.imageFile);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.imageDataUrl !== this.state.imageDataUrl;
  }
  processImageFile(imageFile) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        imageDataUrl: reader.result
      });
    });
    reader.readAsDataURL(imageFile);
  }
  render() {
    const _this$props = this.props,
      rest = _objectWithoutPropertiesLoose(_this$props, _excluded);
    return /*#__PURE__*/_jsx(VizExImage, Object.assign({
      src: this.state.imageDataUrl
    }, rest));
  }
}
ImageAttachmentPreview.displayName = 'ImageAttachmentPreview';
export default ImageAttachmentPreview;