"use es6";

import * as React from "react";
import {
    canUseDOM
} from "apollo-stack-hubspot/@apollo/client/utilities/index";
// use canUseDOM here instead of canUseLayoutEffect because we want to be able
// to use useLayoutEffect in our jest tests. useLayoutEffect seems to work fine
// in useSuspenseQuery tests, but to honor the original comment about the
// warnings for useSyncExternalStore implementation, canUseLayoutEffect is left
// alone.
export var useIsomorphicLayoutEffect = canUseDOM ? React.useLayoutEffect : React.useEffect;