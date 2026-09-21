let quickFetch = typeof window !== 'undefined' ? window.quickFetch : undefined;
if (typeof window === 'undefined' || !window.quickFetch) {
  console.warn('[quick-fetch] quickFetchScript was not included or running in Node.js environment. Falling back to stubbed implementation.');
  quickFetch = {
    afterAuth() {},
    clearAllRequests() {},
    clearEarlyRequestHistory() {},
    getApiUrl() {},
    getPortalId() {},
    getRequestStateByName() {
      return null;
    },
    getAllEarlyRequestStats() {
      return [];
    },
    makeEarlyRequest() {},
    makeLoginVerifyRequest() {},
    getLoginVerifyRequest() {
      return null;
    },
    removeEarlyRequest() {},
    getCookie() {
      return null;
    },
    hasEarlyRequests() {
      return false;
    }
  };
}
export default quickFetch;