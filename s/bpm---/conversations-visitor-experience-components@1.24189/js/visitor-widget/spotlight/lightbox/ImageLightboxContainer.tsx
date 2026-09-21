import ImageLightbox from './ImageLightbox';
import { useImageLightbox } from '../../../lightbox/ImageLightboxContext';

/**
 * Reads lightbox state from `ImageLightboxContext` and renders `ImageLightbox`.
 * Exists as a separate component from `ImageLightbox` so that the overlay
 * component itself stays a pure presentational component (props only), while
 * this container handles the context wiring. Must be rendered inside
 * `ImageLightboxProvider`.
 */
import { jsx as _jsx } from "react/jsx-runtime";
const ImageLightboxContainer = () => {
  const {
    isOpen,
    images,
    currentIndex,
    closeLightbox,
    goNext,
    goPrev
  } = useImageLightbox();
  return /*#__PURE__*/_jsx(ImageLightbox, {
    isOpen: isOpen,
    onClose: closeLightbox,
    images: images,
    currentIndex: currentIndex,
    onNext: goNext,
    onPrev: goPrev
  });
};
ImageLightboxContainer.displayName = 'ImageLightboxContainer';
export default ImageLightboxContainer;