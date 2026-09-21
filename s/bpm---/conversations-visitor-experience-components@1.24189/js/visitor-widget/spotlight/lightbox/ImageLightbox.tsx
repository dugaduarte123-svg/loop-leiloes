import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FocusScope } from '@react-aria/focus';
import I18n from 'I18n';
import useWidgetOverlay from 'conversations-visitor-message-history/widget-modal/useWidgetOverlay';
import styled from 'styled-components';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import SVGLeft from 'visitor-ui-component-library-icons/icons/SVGLeft';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import VizExLoadingSpinner from 'visitor-ui-component-library/loading/VizExLoadingSpinner';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
const LightboxOverlay = styled.div.withConfig({
  displayName: "ImageLightbox__LightboxOverlay"
})(["position:fixed;inset:0;background:", ";z-index:", ";display:flex;align-items:center;justify-content:center;"], ({
  theme
}) => theme.spotlight.color.messageText, ({
  theme
}) => theme.spotlight.zIndex.lightbox);
const LightboxDialog = styled.div.withConfig({
  displayName: "ImageLightbox__LightboxDialog"
})(["position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;outline:none;"]);
const OverlayButton = styled.button.withConfig({
  displayName: "ImageLightbox__OverlayButton"
})(["position:absolute;background:", ";border:none;border-radius:", ";width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:0;color:", ";transition:filter 150ms ease;&:hover{filter:brightness(0.9);}&[aria-disabled='true']{opacity:0.3;pointer-events:none;cursor:default;}"], ({
  theme
}) => theme.spotlight.color.userBubble, ({
  theme
}) => theme.spotlight.borderRadius.pill, ({
  theme
}) => theme.spotlight.color.ink);
const CloseButton = styled(OverlayButton).withConfig({
  displayName: "ImageLightbox__CloseButton"
})(["top:", ";right:", ";z-index:1;"], ({
  theme
}) => theme.spotlight.spacing.lg, ({
  theme
}) => theme.spotlight.spacing.lg);
const PrevButton = styled(OverlayButton).withConfig({
  displayName: "ImageLightbox__PrevButton"
})(["top:50%;left:", ";transform:translateY(-50%);"], ({
  theme
}) => theme.spotlight.spacing.lg);
const NextButton = styled(OverlayButton).withConfig({
  displayName: "ImageLightbox__NextButton"
})(["top:50%;right:", ";transform:translateY(-50%);"], ({
  theme
}) => theme.spotlight.spacing.lg);
const ImageContentWrapper = styled.div.withConfig({
  displayName: "ImageLightbox__ImageContentWrapper"
})(["display:flex;flex-direction:column;align-items:center;gap:", ";"], ({
  theme
}) => theme.spotlight.spacing.sm);
const ImageArea = styled.div.withConfig({
  displayName: "ImageLightbox__ImageArea"
})(["display:flex;align-items:center;justify-content:center;"]);
const StyledImg = styled.img.withConfig({
  displayName: "ImageLightbox__StyledImg"
})(["max-width:75vw;max-height:65vh;object-fit:contain;border-radius:", ";display:block;"], ({
  theme
}) => theme.spotlight.borderRadius.sm);
const ImageCaption = styled.p.withConfig({
  displayName: "ImageLightbox__ImageCaption"
})(["color:", ";font-size:", ";text-align:center;margin:0;opacity:0.7;"], ({
  theme
}) => theme.spotlight.color.surface, ({
  theme
}) => theme.spotlight.typography.fontSize.xl);
const ErrorMessage = styled.p.withConfig({
  displayName: "ImageLightbox__ErrorMessage"
})(["color:", ";font-size:", ";text-align:center;margin:0;"], ({
  theme
}) => theme.spotlight.color.surface, ({
  theme
}) => theme.spotlight.typography.fontSize.lg);
const Counter = styled.div.withConfig({
  displayName: "ImageLightbox__Counter"
})(["position:absolute;bottom:", ";left:50%;transform:translateX(-50%);color:", ";font-size:", ";pointer-events:none;white-space:nowrap;opacity:0.7;"], ({
  theme
}) => theme.spotlight.spacing.lg, ({
  theme
}) => theme.spotlight.color.surface, ({
  theme
}) => theme.spotlight.typography.fontSize.xl);
const ImageLightbox = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev
}) => {
  const currentImage = images[currentIndex];
  const {
    overlayProps,
    underlayProps,
    dialogProps,
    dialogRef
  } = useWidgetOverlay({
    isOpen,
    onClose,
    // Include the image name so screen readers announce which image is shown
    // when focus enters the dialog (e.g. "Image preview: Sales Dashboard").
    ariaLabel: currentImage ? `${I18n.text('conversations-visitor-experience-components.spotlightLightbox.dialogLabel')}: ${currentImage.alt}` : I18n.text('conversations-visitor-experience-components.spotlightLightbox.dialogLabel')
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [currentIndex, isOpen]);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;
  const hasMultipleImages = images.length > 1;
  const handleKeyDown = e => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && !isFirst) onPrev();
    if (e.key === 'ArrowRight' && !isLast) onNext();
  };
  if (!isOpen || !currentImage) return null;
  return /*#__PURE__*/createPortal( /*#__PURE__*/_jsx(LightboxOverlay, Object.assign({}, underlayProps, {
    children: /*#__PURE__*/_jsx(FocusScope, {
      contain: true,
      restoreFocus: true,
      autoFocus: true,
      children: /*#__PURE__*/_jsxs(LightboxDialog, Object.assign({}, overlayProps, dialogProps, {
        ref: dialogRef,
        onKeyDown: handleKeyDown,
        "aria-modal": true,
        children: [/*#__PURE__*/_jsx(CloseButton, {
          type: "button",
          onClick: onClose,
          "data-test-id": "lightbox-close-button",
          "aria-label": I18n.text('conversations-visitor-experience-components.spotlightLightbox.close'),
          children: /*#__PURE__*/_jsx(VizExIcon, {
            icon: /*#__PURE__*/_jsx(SVGClose, {}),
            size: "sm"
          })
        }), /*#__PURE__*/_jsxs(ImageContentWrapper, {
          children: [/*#__PURE__*/_jsxs(ImageArea, {
            "aria-busy": isLoading,
            children: [isLoading && !hasError && /*#__PURE__*/_jsx(VizExLoadingSpinner, {
              size: "sm",
              use: "secondary"
            }), hasError ? /*#__PURE__*/_jsx(ErrorMessage, {
              "aria-live": "polite",
              children: I18n.text('conversations-visitor-experience-components.spotlightLightbox.errorMessage')
            }) : /*#__PURE__*/_jsx(StyledImg, {
              src: currentImage.src,
              alt: currentImage.alt,
              style: {
                display: isLoading ? 'none' : 'block'
              },
              onLoad: () => setIsLoading(false),
              onError: () => {
                setIsLoading(false);
                setHasError(true);
              }
            }, currentIndex)]
          }), !isLoading && !hasError && currentImage.alt && /*#__PURE__*/_jsx(ImageCaption, {
            children: currentImage.alt
          })]
        }), hasMultipleImages && /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(PrevButton, {
            type: "button",
            onClick: () => !isFirst && onPrev(),
            "data-test-id": "lightbox-prev-button",
            "aria-label": I18n.text('conversations-visitor-experience-components.spotlightLightbox.previousImage'),
            "aria-disabled": isFirst,
            children: /*#__PURE__*/_jsx(VizExIcon, {
              icon: /*#__PURE__*/_jsx(SVGLeft, {}),
              size: "sm"
            })
          }), /*#__PURE__*/_jsx(NextButton, {
            type: "button",
            onClick: () => !isLast && onNext(),
            "data-test-id": "lightbox-next-button",
            "aria-label": I18n.text('conversations-visitor-experience-components.spotlightLightbox.nextImage'),
            "aria-disabled": isLast,
            children: /*#__PURE__*/_jsx(VizExIcon, {
              icon: /*#__PURE__*/_jsx(SVGLeft, {
                style: {
                  transform: 'rotate(180deg)'
                }
              }),
              size: "sm"
            })
          }), /*#__PURE__*/_jsx(Counter, {
            "aria-live": "polite",
            "aria-atomic": "true",
            children: I18n.text('conversations-visitor-experience-components.spotlightLightbox.imageCounter', {
              current: currentIndex + 1,
              total: images.length
            })
          })]
        })]
      }))
    })
  })), document.body);
};
ImageLightbox.displayName = 'ImageLightbox';
export default ImageLightbox;