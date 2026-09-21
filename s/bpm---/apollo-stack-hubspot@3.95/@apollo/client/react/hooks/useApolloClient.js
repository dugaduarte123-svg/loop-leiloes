"use es6";

import {
    invariant
} from "apollo-stack-hubspot/@apollo/client/utilities/globals/index";
import * as React from "react";
import {
    getApolloContext
} from "apollo-stack-hubspot/@apollo/client/react/context/index";
/**
 * @example
 * ```jsx
 * import { useApolloClient } from '@apollo/client';
 *
 * function SomeComponent() {
 *   const client = useApolloClient();
 *   // `client` is now set to the `ApolloClient` instance being used by the
 *   // application (that was configured using something like `ApolloProvider`)
 * }
 * ```
 *
 * @since 3.0.0
 * @returns The `ApolloClient` instance being used by the application.
 */
export function useApolloClient(override) {
    var context = React.useContext(getApolloContext());
    var client = override || context.client;
    invariant(!!client, 50);
    return client;
}