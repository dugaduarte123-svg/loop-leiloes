'use es6';

import {
    filterDOMProps,
    mergeProps,
    useId
} from '@react-aria/utils';
import {
    useHover,
    usePress,
    getInteractionModality,
    isFocusVisible
} from '@react-aria/interactions';
import {
    useRef,
    useEffect
} from 'react';
import {
    useFocusable
} from '@react-aria/focus';

function $326e436e94273fe1$export$1c4b08e0eca38426(props, state) {
    let domProps = filterDOMProps(props, {
        labelable: true
    });
    let {
        hoverProps: hoverProps
    } = useHover({
        onHoverStart: () => {
            return state === null || state === void 0 ? void 0 : state.open(true);
        },
        onHoverEnd: () => {
            return state === null || state === void 0 ? void 0 : state.close();
        }
    });
    return {
        tooltipProps: mergeProps(domProps, hoverProps, {
            role: 'tooltip'
        })
    };
}

function $4e1b34546679e357$export$a6da6c504e4bba8b(props, state, ref) {
    let {
        isDisabled: isDisabled,
        trigger: trigger
    } = props;
    let tooltipId = useId();
    let isHovered = useRef(false);
    let isFocused = useRef(false);
    let handleShow = () => {
        if (isHovered.current || isFocused.current) state.open(isFocused.current);
    };
    let handleHide = immediate => {
        if (!isHovered.current && !isFocused.current) state.close(immediate);
    };
    useEffect(() => {
        let onKeyDown = e => {
            if (ref && ref.current)
            // Escape after clicking something can give it keyboard focus
            // dismiss tooltip on esc key press
            {
                if (e.key === 'Escape') state.close(true);
            }
        };
        if (state.isOpen) {
            document.addEventListener('keydown', onKeyDown, true);
            return () => {
                document.removeEventListener('keydown', onKeyDown, true);
            };
        }
    }, [ref, state]);
    let onHoverStart = () => {
        if (trigger === 'focus') return;
        // In chrome, if you hover a trigger, then another element obscures it, due to keyboard
        // interactions for example, hover will end. When hover is restored after that element disappears,
        // focus moves on for example, then the tooltip will reopen. We check the modality to know if the hover
        // is the result of moving the mouse.
        if (getInteractionModality() === 'pointer') isHovered.current = true;
        else isHovered.current = false;
        handleShow();
    };
    let onHoverEnd = () => {
        if (trigger === 'focus') return;
        // no matter how the trigger is left, we should close the tooltip
        isFocused.current = false;
        isHovered.current = false;
        handleHide();
    };
    let onPressStart = () => {
        // no matter how the trigger is pressed, we should close the tooltip
        isFocused.current = false;
        isHovered.current = false;
        handleHide(true);
    };
    let onFocus = () => {
        let isVisible = isFocusVisible();
        if (isVisible) {
            isFocused.current = true;
            handleShow();
        }
    };
    let onBlur = () => {
        isFocused.current = false;
        isHovered.current = false;
        handleHide(true);
    };
    let {
        hoverProps: hoverProps
    } = useHover({
        isDisabled: isDisabled,
        onHoverStart: onHoverStart,
        onHoverEnd: onHoverEnd
    });
    let {
        pressProps: pressProps
    } = usePress({
        onPressStart: onPressStart
    });
    let {
        focusableProps: focusableProps
    } = useFocusable({
        isDisabled: isDisabled,
        onFocus: onFocus,
        onBlur: onBlur
    }, ref);
    return {
        triggerProps: Object.assign({
            'aria-describedby': state.isOpen ? tooltipId : undefined
        }, mergeProps(focusableProps, hoverProps, pressProps)),
        tooltipProps: {
            id: tooltipId
        }
    };
}
export {
    $326e436e94273fe1$export$1c4b08e0eca38426 as useTooltip, $4e1b34546679e357$export$a6da6c504e4bba8b as useTooltipTrigger
};