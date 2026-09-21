export default class SoftNavLcpObserver {
  constructor(getElementSelector, getNearestComponentName) {
    this.navStartTime = 0;
    this.candidate = null;
    this.mutationObserver = null;
    this.pendingRafs = new Set();
    this.imageLoadCleanups = [];
    this.getElementSelector = getElementSelector;
    this.getNearestComponentName = getNearestComponentName;
  }
  start(navStartTime) {
    this.reset();
    this.navStartTime = navStartTime;
    if (!document.body) {
      return;
    }
    this.mutationObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.scheduleElementCheck(node);
          }
        }
      }
    });
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  stop() {
    const result = this.candidate;
    this.reset();
    return result;
  }
  reset() {
    var _this$mutationObserve;
    (_this$mutationObserve = this.mutationObserver) === null || _this$mutationObserve === void 0 || _this$mutationObserve.disconnect();
    this.mutationObserver = null;
    this.pendingRafs.forEach(id => cancelAnimationFrame(id));
    this.pendingRafs.clear();
    this.imageLoadCleanups.forEach(cleanup => cleanup());
    this.imageLoadCleanups = [];
    this.candidate = null;
    this.navStartTime = 0;
  }
  scheduleElementCheck(el) {
    // Check the element itself plus any img/video descendants (most likely LCP candidates)
    const targets = [el];
    el.querySelectorAll('img, video').forEach(child => targets.push(child));
    targets.forEach(target => {
      var _target$tagName, _target$tagName2;
      if (((_target$tagName = target.tagName) === null || _target$tagName === void 0 ? void 0 : _target$tagName.toLowerCase()) === 'img') {
        const img = target;
        if (img.complete && img.naturalWidth > 0) {
          this.scheduleCheck(img);
        } else {
          const onLoad = () => this.scheduleCheck(img);
          img.addEventListener('load', onLoad, {
            once: true
          });
          this.imageLoadCleanups.push(() => img.removeEventListener('load', onLoad));
        }
      } else if (((_target$tagName2 = target.tagName) === null || _target$tagName2 === void 0 ? void 0 : _target$tagName2.toLowerCase()) === 'video') {
        const video = target;
        // Use HAVE_CURRENT_DATA / loadeddata rather than HAVE_METADATA / loadedmetadata:
        // loadedmetadata fires when dimensions are known but before any frame is decoded,
        // so getBoundingClientRect may still return zero. loadeddata fires when the first
        // frame is available, which aligns with when the browser records a video LCP entry.
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          this.scheduleCheck(video);
        } else {
          const onLoadedData = () => this.scheduleCheck(video);
          video.addEventListener('loadeddata', onLoadedData, {
            once: true
          });
          this.imageLoadCleanups.push(() => video.removeEventListener('loadeddata', onLoadedData));
        }
      } else {
        this.scheduleCheck(target);
      }
    });
  }
  scheduleCheck(el) {
    const rafId = requestAnimationFrame(frameTime => {
      this.pendingRafs.delete(rafId);
      this.checkCandidate(el, frameTime);
    });
    this.pendingRafs.add(rafId);
  }
  checkCandidate(el, frameTime) {
    try {
      var _this$candidate$size, _this$candidate;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visibleW = Math.min(rect.right, vw) - Math.max(rect.left, 0);
      const visibleH = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visibleW <= 0 || visibleH <= 0) {
        return;
      }
      const size = visibleW * visibleH;
      if (size > ((_this$candidate$size = (_this$candidate = this.candidate) === null || _this$candidate === void 0 ? void 0 : _this$candidate.size) !== null && _this$candidate$size !== void 0 ? _this$candidate$size : 0)) {
        var _el$tagName, _el$id;
        const tag = (_el$tagName = el.tagName) === null || _el$tagName === void 0 ? void 0 : _el$tagName.toLowerCase();
        this.candidate = {
          size,
          startTime: frameTime,
          renderTime: frameTime - this.navStartTime,
          element: this.getElementSelector(el),
          componentName: this.getNearestComponentName(el),
          id: (_el$id = el.id) !== null && _el$id !== void 0 ? _el$id : '',
          url: tag === 'img' ? el.currentSrc : tag === 'video' ? el.currentSrc : ''
        };
      }
    } catch (_unused) {
      // getBoundingClientRect can throw in detached elements; skip silently
    }
  }
}