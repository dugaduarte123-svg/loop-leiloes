"use es6";

import * as React from "react";
// Prevent webpack from complaining about our feature detection of the
// useSyncExternalStore property of the React namespace, which is expected not
// to exist when using React 17 and earlier, and that's fine.
var uSESKey = "useSyncExternalStore";
var realHook = React[uSESKey];
// Adapted from https://www.npmjs.com/package/use-sync-external-store, with
// Apollo Client deviations called out by "// DEVIATION ..." comments.
// When/if React.useSyncExternalStore is defined, delegate fully to it.
export var useSyncExternalStore = realHook;