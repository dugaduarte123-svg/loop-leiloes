// Default window within which peer-provided data is treated as fresh. Beyond
// this, an adopted value is applied on the stale side (shown immediately while
// a refresh runs) so bounced data can't stay locked in indefinitely.
// 10m — 2x the GC MAX_PERIOD (5m) ceiling on how long a detached resource
// survives in a peer's memory, so the TTL catches continuously-bounced data
// rather than racing collection.
export const PEER_SYNC_DEFAULT_MAX_AGE = 1000 * 60 * 10;
let __enabled = true;
export const __testOnlyDisablePeerSync = () => {
  __enabled = false;
};
export const __testOnlyEnablePeerSync = () => {
  __enabled = true;
};
export const peerSyncEnabled = () => {
  return __enabled;
};
const initResponseEvent = instanceKey => `pulse:peer-response:${instanceKey}`;
const dispatchInitResponse = (instanceKey, clientId, value) => window.dispatchEvent(new CustomEvent(initResponseEvent(instanceKey), {
  detail: Object.assign({}, value, {
    sourceId: clientId
  })
}));
const INIT_REQUEST_EVENT = 'pulse:peer-request';
const dispatchInitRequest = (instanceKey, clientId) => window.dispatchEvent(new CustomEvent(INIT_REQUEST_EVENT, {
  detail: {
    instanceKey,
    sourceId: clientId
  }
}));
const STATE_BATCH_EVENT = 'pulse:state-batch';
export const peerSyncManager = ({
  clientId,
  getState,
  getStoredAt,
  applyBatch
}) => {
  const onInitRequest = event => {
    if (peerSyncEnabled() && event.detail.sourceId !== clientId) {
      const state = getState(event.detail.instanceKey);
      if ((state === null || state === void 0 ? void 0 : state.data) !== undefined && !state.loading && !state.error) {
        dispatchInitResponse(event.detail.instanceKey, clientId, {
          data: state.data,
          storedAt: getStoredAt(event.detail.instanceKey),
          stale: state.stale
        });
      }
    }
  };
  window.addEventListener(INIT_REQUEST_EVENT, onInitRequest);
  const onStateBatch = ({
    detail: {
      changes,
      sourceId
    }
  }) => {
    if (sourceId !== clientId) {
      applyBatch(changes);
    }
  };
  window.addEventListener(STATE_BATCH_EVENT, onStateBatch);
  let batch = [];
  return {
    pull: instanceKey => {
      if (!peerSyncEnabled()) {
        return undefined;
      }

      // Responses fire synchronously during dispatch, so multiple peers may
      // answer. Keep the freshest by storedAt so we don't adopt an older copy.
      let result;
      const listener = ({
        detail
      }) => {
        if (detail.sourceId !== clientId && detail.data !== undefined) {
          var _detail$storedAt, _result$storedAt;
          if (!result || ((_detail$storedAt = detail.storedAt) !== null && _detail$storedAt !== void 0 ? _detail$storedAt : 0) > ((_result$storedAt = result.storedAt) !== null && _result$storedAt !== void 0 ? _result$storedAt : 0)) {
            result = detail;
          }
        }
      };
      const responseEventName = initResponseEvent(instanceKey);
      window.addEventListener(responseEventName, listener);
      dispatchInitRequest(instanceKey, clientId);
      window.removeEventListener(responseEventName, listener);
      return result;
    },
    collect: (instanceKey, data, storedAt, stale) => {
      if (peerSyncEnabled()) {
        batch.push({
          instanceKey,
          data,
          storedAt,
          stale
        });
      }
    },
    flush: () => {
      if (batch.length === 0) {
        return;
      }
      const changes = batch;
      batch = [];
      window.dispatchEvent(new CustomEvent(STATE_BATCH_EVENT, {
        detail: {
          changes,
          sourceId: clientId
        }
      }));
    },
    destroy: () => {
      window.removeEventListener(INIT_REQUEST_EVENT, onInitRequest);
      window.removeEventListener(STATE_BATCH_EVENT, onStateBatch);
      batch = [];
    }
  };
};