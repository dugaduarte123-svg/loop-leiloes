import stringify from 'fast-json-stable-stringify';
import { fromLinksOnly } from '../resolvers/adapters/fromLinksOnly';
import { defaultResourceRegistry } from './resourceRegistry';
import { LinkBuilder } from '../links/definition/linkBuilder';
import { EQUAL_HASH_MODE } from './types';
import { createResourceMethods } from './resourceMethods';
export const getVersionedTypeName = (typeName, schemaVersion = '1') => `${typeName}@${schemaVersion}`;

/**
 * Produce an instance key that uniquely identifies an instance.
 *
 * Uses length-prefixed encoding to avoid problems with folks using
 * our delimiter in their typeName/instance information.
 */
export const createInstanceKey = (typeName, instanceIdentifier) => `${typeName.length}:${typeName}:${instanceIdentifier}`;
const getTypeNameIndex = key => {
  const colonIndex = key.indexOf(':');
  if (colonIndex === -1) {
    throw Error(`Invalid instance key: ${key}`);
  }
  const typeNameLength = parseInt(key.substring(0, colonIndex), 10);

  // typeName starts after the first colon
  const typeNameStart = colonIndex + 1;
  const typeNameEnd = typeNameStart + typeNameLength;
  return {
    typeNameStart,
    typeNameEnd
  };
};

/**
 * Parse the typeName out of an instance key
 */
export const parseTypeName = key => {
  const {
    typeNameStart,
    typeNameEnd
  } = getTypeNameIndex(key);
  return key.substring(typeNameStart, typeNameEnd);
};
export const parseInstanceKey = key => {
  const {
    typeNameStart,
    typeNameEnd
  } = getTypeNameIndex(key);
  return {
    typeName: key.substring(typeNameStart, typeNameEnd),
    identifier: key.substring(typeNameEnd + 1)
  };
};
export const applyDefaultsToEgg = egg => {
  const versionedTypeName = getVersionedTypeName(egg.typeName, egg.schemaVersion);
  const instanceKeyPrefix = `${versionedTypeName.length}:${versionedTypeName}:`;
  const resolveArg = (arg, params) => {
    var _record$arg$field;
    const record = params;
    if (typeof arg === 'string') {
      const v = record[arg];
      return `${arg}:${typeof v === 'object' && v !== null ? stringify(v) : v}`;
    }
    const v = (_record$arg$field = record[arg.field]) !== null && _record$arg$field !== void 0 ? _record$arg$field : arg.default;
    return `${arg.field}:${typeof v === 'object' && v !== null ? stringify(v) : v}`;
  };
  const deriveIdentifier = params => {
    if (egg.args && egg.args.length) {
      let result = resolveArg(egg.args[0], params);
      for (let i = 1; i < egg.args.length; i++) {
        // eslint-disable-next-line prefer-template
        result += ',' + resolveArg(egg.args[i], params);
      }
      return result;
    }
    return '';
  };
  const definition = Object.assign({}, egg, {
    typeName: versionedTypeName,
    resolver: egg.resolver,
    identifyInstance: params => instanceKeyPrefix + deriveIdentifier(params),
    hash: Object.assign({
      mode: EQUAL_HASH_MODE,
      create: data => data
    }, egg.hash)
  });
  const resource = Object.assign(definition, createResourceMethods(definition));
  return Object.freeze(resource);
};

/**
 * Create a basic resource definition. Must be statically analyzable (i.e called in module scope). This will be enforced.
 *
 * Automatically registers the resource with the global registry.
 *
 * @param typeName - A string that uniquely identifies the resource's type
 * @param schemaVersion - The version of the schema for this resource. Defaults to '1'.
 * @param resolver - The resolver used for this resource.
 * @param args - An array of param keys that identify a unique instance. Entries can be bare keys (`'userId'`) or `{ field, default }` objects for optional params with semantic defaults. Required unless params are empty.
 * @param hash.create - A function that produces a hash for a resource's data used for change detection (defaults to returning the data for a reference check)
 * @param hash.mode - The type of comparison to use when comparing hashes. Defaults to EQUAL (===). Use GREATER to compare timestamps or version numbers (requires create to return a number)
 * @param onChange - A function that is called when the resource's state changes. Used when updates need to be pushed into other systems on change.
 *
 * @example
 * ```ts
 * // Define a "User" resource derived from a promise-based fetcher
 *
 * const fetchUser = (httpClient, { userId }: { userId: number }) =>
 *   httpClient.get<User>(`users/v1/users/${userId}`);
 *
 * const userResolver = fromPromise('fetchUser', fetchUser);
 *
 * const User = defineResource({
 *   typeName: 'User',
 *   resolver: userResolver,
 *   args: ['userId'],
 *   hash: {
 *     create: stableStringify // for a deep structural diff (useful for small objects)
 *   }
 * }).register();
 *
 * const Team = defineResource({
 *   typeName: 'Team',
 *   resolver: teamResolver,
 *   args: ['teamId'],
 *   hash: {
 *     // Check that new timestamp is greater than old
 *     mode: 'GREATER',
 *     create: data => data.updatedAt
 *   }
 * }).register();
 *
 * // pass to useResource in React
 * const {
 *   data: user,
 *   loading,
 *   error,
 *   stale,
 * } = useResource(User, { params: { userId: 123 } });
 * ```
 */

const buildResource = ({
  typeName,
  schemaVersion,
  resolver,
  args,
  hash,
  persist,
  peerSyncMaxAge
}) => {
  let onChangeHandler;
  const links = [];
  const resource = applyDefaultsToEgg({
    typeName,
    schemaVersion,
    resolver,
    args,
    hash,
    persist,
    peerSyncMaxAge
  });
  const getResourceWithOnChange = () => {
    if (!onChangeHandler) {
      return resource;
    }
    const withOnChange = Object.assign({}, resource, {
      onChange: onChangeHandler
    });
    return Object.freeze(Object.assign(withOnChange, createResourceMethods(withOnChange)));
  };
  const register = (__targetRegistry = defaultResourceRegistry) => {
    const fullResource = getResourceWithOnChange();
    __targetRegistry.registerResource(fullResource, links);
    return fullResource;
  };
  const linksResult = {
    register,
    linkTo: (target, construct) => {
      if (!target) {
        throw new Error('Target is undefined. Please check for an import cycle');
      }
      links.push(construct(new LinkBuilder(resource, target)).finalize());
      return linksResult;
    }
  };
  return Object.assign({
    onChange: fn => {
      onChangeHandler = fn;
      return linksResult;
    }
  }, linksResult);
};
export const defineResource = egg => buildResource(egg);

/**
 * Define a resource with no transport of its own, populated only via links from
 * another resource (the `fromLinksOnly` resolver is wired in for you).
 *
 * Use it for a by-id resource when there is no by-id endpoint — a bulk query
 * fans out into per-id entries via a `.push()` / `.pull()` link. A cold read (no
 * pushed data) errors loudly with {@link LINK_ONLY_NO_FETCH_MESSAGE}, which
 * consumers must treat as "not in cache yet"; any refresh / invalidate / poll
 * also errors, since there is nothing to refetch. See the "Client-side
 * normalization" recipe.
 *
 * Takes the same options as `defineResource` except `resolver`, and returns the
 * same chainable builder. Persistence config is intentionally excluded — it is
 * meaningless on a virtual, frontend-only resource.
 *
 * @example
 * ```ts
 * const CalendarEvent = defineLinkOnlyResource<{ id: string }, CalendarEventData>({
 *   typeName: 'calendar:CalendarEvent',
 *   args: ['id'],
 * })
 *   .linkTo(CalendarEventsByDateRange, (b) =>
 *     b
 *       .findSelf({ fromOtherData: ({ data }) => data.map(({ id }) => ({ id })) })
 *       .pull(({ self, other }) => other.data.find(({ id }) => id === self.params.id))
 *   )
 *   .register();
 * ```
 */
export const defineLinkOnlyResource = egg => buildResource(Object.assign({}, egg, {
  resolver: fromLinksOnly(egg.typeName)
}));