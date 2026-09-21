import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/** A single image entry for the lightbox carousel. `alt` is used both for
 *  accessibility and as the visible caption below the image. */
import { jsx as _jsx } from "react/jsx-runtime";
export const ImageLightboxContext = /*#__PURE__*/createContext(undefined);
export const ImageLightboxProvider = ({
  children,
  isWidgetOpen,
  onLightboxIsOpen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    onLightboxIsOpen === null || onLightboxIsOpen === void 0 || onLightboxIsOpen(false);
  }, [onLightboxIsOpen]);
  useEffect(() => {
    if (isWidgetOpen === false) {
      setIsOpen(false);
      onLightboxIsOpen === null || onLightboxIsOpen === void 0 || onLightboxIsOpen(false);
    }
  }, [isWidgetOpen, onLightboxIsOpen]);
  const openLightbox = useCallback((newImages, initialIndex) => {
    setImages(newImages);
    setCurrentIndex(initialIndex);
    setIsOpen(true);
    onLightboxIsOpen === null || onLightboxIsOpen === void 0 || onLightboxIsOpen(true);
  }, [onLightboxIsOpen]);
  const goNext = useCallback(() => setCurrentIndex(i => Math.min(i + 1, images.length - 1)), [images.length]);
  const goPrev = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), []);
  return /*#__PURE__*/_jsx(ImageLightboxContext.Provider, {
    value: {
      isOpen,
      images,
      currentIndex,
      openLightbox,
      closeLightbox,
      goNext,
      goPrev
    },
    children: children
  });
};
ImageLightboxProvider.displayName = 'ImageLightboxProvider';

/** Must be called inside an `ImageLightboxProvider`. Throws otherwise so
 *  missing provider wiring is caught at development time. */
export const useImageLightbox = () => {
  const context = useContext(ImageLightboxContext);
  if (!context) {
    throw new Error('useImageLightbox must be used within an ImageLightboxProvider');
  }
  return context;
};