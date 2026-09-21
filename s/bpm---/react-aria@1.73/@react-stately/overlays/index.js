'use es6';

import {
    useControlledState
} from '@react-stately/utils';

function $fc909762b330b746$export$61c6a8c84e605fb6(props) {
    let [isOpen, setOpen] = useControlledState(props.isOpen, props.defaultOpen || false, props.onOpenChange);
    return {
        isOpen: isOpen,
        setOpen: setOpen,
        open() {
            setOpen(true);
        },
        close() {
            setOpen(false);
        },
        toggle() {
            setOpen(!isOpen);
        }
    };
}
export {
    $fc909762b330b746$export$61c6a8c84e605fb6 as useOverlayTriggerState
};