import { useRef } from 'react';
import { useDialog } from '@react-aria/dialog';
import { useOverlay } from '@react-aria/overlays';
/**
 * Shared accessibility scaffolding for modal overlays.
 *
 * Combines `useOverlay` (ESC-to-close, click-outside), `useDialog` (role,
 * aria-label), and a `dialogRef` into a single call so every overlay in the
 * widget uses the same react-aria wiring without duplicating the three hooks.
 *
 * `underlayProps` → spread on the scrim/backdrop element.
 * `overlayProps` + `dialogProps` + `dialogRef` → spread on the dialog element.
 */
const useWidgetOverlay = ({
  isOpen,
  onClose,
  id,
  ariaLabel
}) => {
  const dialogRef = useRef(null);
  const {
    overlayProps,
    underlayProps
  } = useOverlay({
    isOpen,
    onClose,
    shouldCloseOnBlur: false
  },
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  dialogRef);
  const {
    dialogProps
  } = useDialog(Object.assign({}, id ? {
    id
  } : {}, ariaLabel ? {
    'aria-label': ariaLabel
  } : {}),
  // TODO: remove cast when on React 19 types (HubSpotEngineering/fefw#73)
  dialogRef);
  return {
    overlayProps,
    underlayProps,
    dialogProps,
    dialogRef
  };
};
export default useWidgetOverlay;