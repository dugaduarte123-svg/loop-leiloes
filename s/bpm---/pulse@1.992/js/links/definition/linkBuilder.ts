import { ON_ATTACH, ON_DATA } from './link';
import { pushFromData, pullFromData, pushFromDataImmutable, pullFromDataImmutable } from './helpers';

// ─── Types ───────────────────────────────────────────────────────────

/**
 * Every tag matched between the two instances this change, with the context each
 * side contributed. Iterate this to join across all matches in one transform
 * (many-to-many links). For single-match links, `self.context` / `other.context`
 * — the first match — is the simpler read.
 */

// ─── Builder phase interfaces ───────────────────────────────────────
//
// The builder is a type-state machine: methods are only visible when
// their prerequisites have been met. The phases are:
//
//   Initial  ──(findSelf/findOther/tags)──▶  Discovered
//   Discovered  ──(push/pushImmutable/pushState)──▶  PushSet
//   Discovered  ──(pull/pullImmutable/pullState)──▶  PullSet
//   PushSet  ──(pull/pullImmutable/pullState)──▶  Complete
//   PullSet  ──(push/pushImmutable/pushState)──▶  Complete
//
// pushBehavior, pullBehavior, and finalize are available on every
// post-discovery phase (via LinkBuilderFinalizable).
// ─── Internal helpers ────────────────────────────────────────────────

const normalize = result => {
  if (result == null) {
    return [];
  }
  return Array.isArray(result) ? result : [result];
};
const hasContext = result => typeof result === 'object' && result !== null && 'params' in result && 'context' in result;
const behaviorString = behavior => `(${behavior.invalidation ? 'I' : '-'}|${behavior.state ? 'S' : '-'})`;
const toLinkKey = ({
  selfTypeName,
  otherTypeName,
  pushBehavior,
  pullBehavior,
  timing
}) => `${timing}:${selfTypeName}${behaviorString(pushBehavior)}><${behaviorString(pullBehavior)}${otherTypeName}`;

// ─── Builder ─────────────────────────────────────────────────────────

export class LinkBuilder {
  constructor(selfResource, otherResource) {
    this.selfResource = selfResource;
    this.otherResource = otherResource;
    this.link = {
      key: '',
      selfTypeName: selfResource.typeName,
      otherTypeName: otherResource.typeName,
      timing: ON_ATTACH,
      pushBehavior: {
        state: false,
        invalidation: true
      },
      pullBehavior: {
        state: false,
        invalidation: true
      }
    };
  }

  /**
   * Find self using the other instance's params or data. Use when the other side
   * knows how to locate self rather than vice versa.
   *
   * @example
   * // Parent doesn't know its children, but children's params contain the parent id
   * Parent.linkTo(Child, b => b.findSelf({ fromOtherParams: ({ params }) => ({ id: params.parentId }) }))
   */

  findSelf(config) {
    const {
      fromOtherParams: paramsFn,
      fromOtherData: dataFn
    } = config;
    if (dataFn) {
      this.link = Object.assign({}, this.link, {
        timing: ON_DATA,
        tagParams: {
          self: ({
            params
          }) => [this.selfResource.identifyInstance(params)]
        },
        tagData: {
          other: ({
            data,
            params
          }) => {
            const results = normalize(dataFn({
              data,
              params
            }));
            return results.map(r => hasContext(r) ? {
              tag: this.selfResource.identifyInstance(r.params),
              context: r.context
            } : this.selfResource.identifyInstance(r));
          }
        }
      });
    } else if (paramsFn) {
      this.link = Object.assign({}, this.link, {
        timing: ON_ATTACH,
        tagParams: {
          self: ({
            params
          }) => [this.selfResource.identifyInstance(params)],
          other: ({
            params
          }) => normalize(paramsFn({
            params
          })).map(this.selfResource.identifyInstance)
        }
      });
    }
    return this;
  }

  /**
   * Find the other instance using self's params or data.
   *
   * Use `fromSelfParams` when self's params are enough to identify other (link is established on attach).
   * Use `fromSelfData` when you need self's resolved data to determine which other instances to link
   * (link is established after data loads). Return `{ params, context }[]` from `fromSelfData` to
   * attach typed context accessible via `self.context` in push/pull.
   *
   * @example
   * // PropertyValue knows its CrmObject from params alone
   * .findOther({ fromSelfParams: ({ params }) => ({ objectTypeId: params.objectTypeId, objectId: params.objectId }) })
   *
   * // CrmSearch discovers CrmObjects from response data
   * .findOther({ fromSelfData: ({ data }) => data.results.map(r => ({ objectTypeId: r.objectTypeId, objectId: r.objectId })) })
   */

  findOther(config) {
    const {
      fromSelfParams: paramsFn,
      fromSelfData: dataFn
    } = config;
    if (dataFn) {
      this.link = Object.assign({}, this.link, {
        timing: ON_DATA,
        tagParams: {
          other: ({
            params
          }) => [this.otherResource.identifyInstance(params)]
        },
        tagData: {
          self: ({
            data,
            params
          }) => {
            const results = normalize(dataFn({
              data,
              params
            }));
            return results.map(r => hasContext(r) ? {
              tag: this.otherResource.identifyInstance(r.params),
              context: r.context
            } : this.otherResource.identifyInstance(r));
          }
        }
      });
    } else if (paramsFn) {
      this.link = Object.assign({}, this.link, {
        timing: ON_ATTACH,
        tagParams: {
          self: ({
            params
          }) => normalize(paramsFn({
            params
          })).map(this.otherResource.identifyInstance),
          other: ({
            params
          }) => [this.otherResource.identifyInstance(params)]
        }
      });
    }
    return this;
  }

  /**
   * Low-level tag-based instance matching. Both sides independently produce string tags;
   * instances are linked when their tags match. Use this when `findSelf`/`findOther` can't
   * express the relationship (e.g. many-to-many, or both sides need to produce tags from data).
   *
   * Return `{ tag, context }` from a `byData` callback to attach typed context
   * accessible via `self.context` / `other.context` in push/pull.
   *
   * @example
   * .tags({
   *   self:  { fromData: ({ data }) => data.items.map((item, i) => ({ tag: item.id, context: i })) },
   *   other: { fromData: ({ data }) => [data.id] },
   * })
   */

  tags(config) {
    const selfParams = config.self && 'fromParams' in config.self ? config.self.fromParams : undefined;
    const selfData = config.self && 'fromData' in config.self ? config.self.fromData : undefined;
    const otherParams = config.other && 'fromParams' in config.other ? config.other.fromParams : undefined;
    const otherData = config.other && 'fromData' in config.other ? config.other.fromData : undefined;
    const hasDataFns = selfData || otherData;
    const wrapTag = fn => fn && (opts => {
      const result = fn(opts);
      return result == null ? undefined : normalize(result);
    });
    this.link = Object.assign({}, this.link, {
      timing: hasDataFns ? ON_DATA : ON_ATTACH,
      tagParams: {
        self: wrapTag(selfParams),
        other: wrapTag(otherParams)
      }
    }, hasDataFns ? {
      tagData: {
        self: wrapTag(selfData),
        other: wrapTag(otherData)
      }
    } : {});
    return this;
  }

  /**
   * When self's data changes, update other's data. Only fires when self has data
   * and the data actually changed.
   *
   * `other.data` is an Immer draft of other's current data: either mutate it in place
   * and return nothing, or return a brand-new value. Returning void without mutating
   * the draft skips the update. (The draft is only valid synchronously inside the
   * transform — don't stash it.)
   *
   * @example
   * // mutate the draft of other's data
   * .push(({ self, other }) => {
   *   if (other.data) {
   *     other.data.items.push(self.data);
   *   }
   * })
   *
   * // or return a fresh value
   * .push(({ self, other }) => self.data.items.find(i => i.id === other.params.id))
   */
  push(transform) {
    this.link = Object.assign({}, this.link, {
      pushBehavior: {
        invalidation: false,
        state: true
      },
      onPush: pushFromData(transform)
    });
    return this;
  }

  /**
   * When other's data changes, update self's data. The reverse of `push` — only fires
   * when other has data and the data actually changed.
   *
   * `self.data` is an Immer draft of self's current data: either mutate it in place
   * and return nothing, or return a brand-new value. Returning void without mutating
   * the draft skips the update. (The draft is only valid synchronously inside the
   * transform — don't stash it.)
   *
   * @example
   * // mutate the draft of self's data
   * .pull(({ self, other }) => {
   *   const item = self.data?.find(i => i.id === other.params.id);
   *   if (item) {
   *     Object.assign(item, other.data);
   *   }
   * })
   *
   * // or return a fresh value
   * .pull(({ self, other }) => self.data && self.data.map(i => i.id === other.params.id ? other.data : i))
   */
  pull(transform) {
    this.link = Object.assign({}, this.link, {
      pullBehavior: {
        invalidation: false,
        state: true
      },
      onPull: pullFromData(transform)
    });
    return this;
  }

  /**
   * Like `push`, but return-only: the transform must return the new value rather
   * than mutate. The immutable counterpart used when the target's data type can't
   * be expressed as a mutable draft, or to opt out of drafting entirely.
   */
  pushImmutable(transform) {
    this.link = Object.assign({}, this.link, {
      pushBehavior: {
        invalidation: false,
        state: true
      },
      onPush: pushFromDataImmutable(transform)
    });
    return this;
  }

  /** Like `pull`, but return-only. The immutable counterpart to `pushImmutable`. */
  pullImmutable(transform) {
    this.link = Object.assign({}, this.link, {
      pullBehavior: {
        invalidation: false,
        state: true
      },
      onPull: pullFromDataImmutable(transform)
    });
    return this;
  }

  /**
   * Like `push`, but operates on the full `ResolverState` (loading, error, stale flags)
   * instead of just data. Use when you need to propagate loading/error states or
   * react to flag changes, not just data changes.
   */
  pushState(handler) {
    this.link = Object.assign({}, this.link, {
      pushBehavior: {
        invalidation: false,
        state: true
      },
      onPush: handler
    });
    return this;
  }

  /** Like `pull`, but operates on the full `ResolverState`. */
  pullState(handler) {
    this.link = Object.assign({}, this.link, {
      pullBehavior: {
        invalidation: false,
        state: true
      },
      onPull: handler
    });
    return this;
  }
  pushBehavior(behavior) {
    this.link = Object.assign({}, this.link, {
      pushBehavior: Object.assign({}, this.link.pushBehavior, behavior)
    });
    return this;
  }
  pullBehavior(behavior) {
    this.link = Object.assign({}, this.link, {
      pullBehavior: Object.assign({}, this.link.pullBehavior, behavior)
    });
    return this;
  }
  finalize() {
    if (this.link.pushBehavior.state && !this.link.onPush) {
      throw Error('Push transform must be defined for data-type link');
    }
    if (this.link.pullBehavior.state && !this.link.onPull) {
      throw Error('Pull transform must be defined for data-type reverse link');
    }
    this.link.key = toLinkKey(this.link);
    return this.link;
  }
}