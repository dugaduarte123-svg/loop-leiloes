"use es6";

import {
    Slot
} from "apollo-stack-hubspot/internal/@wry/context/lib/index";
export const parentEntrySlot = new Slot();
export function nonReactive(fn) {
    return parentEntrySlot.withValue(void 0, fn);
}
export {
    Slot
};
export {
    bind as bindContext, noContext, setTimeout, asyncFromGen
}
from "apollo-stack-hubspot/internal/@wry/context/lib/index";