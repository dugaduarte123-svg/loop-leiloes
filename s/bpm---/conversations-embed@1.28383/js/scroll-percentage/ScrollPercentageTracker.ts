import { getBodyScrollTop } from './util/getBodyScrollTop';
import { getViewportHeight } from './util/getViewportHeight';
import { getPageHeight } from './util/getPageHeight';
import { START_TRACK_SCROLL_PERCENTAGE, STOP_TRACK_SCROLL_PERCENTAGE } from '../iframe-communication/constants/receivedPostMessageTypes';
class ScrollPercentageTracker {
  constructor({
    onScroll
  }) {
    this._onScroll = onScroll;
    this._handleScroll = this._handleScroll.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
  }
  _handleScroll() {
    const pageHeightAndViewportDifference = getPageHeight() - getViewportHeight();
    if (pageHeightAndViewportDifference === 0) {
      return;
    }
    const scrollPercentage = 100 * getBodyScrollTop() / pageHeightAndViewportDifference;
    this._onScroll({
      scrollPercentage
    });
  }
  _add() {
    window.addEventListener('scroll', this._handleScroll, {
      capture: true,
      passive: true
    });
  }
  add() {
    this.remove();
    this._add();
  }
  remove() {
    window.removeEventListener('scroll', this._handleScroll, {
      capture: true
    });
  }
  registerPostMessageReceivers(postMessageReceiver) {
    postMessageReceiver.register(START_TRACK_SCROLL_PERCENTAGE, this.add);
    postMessageReceiver.register(STOP_TRACK_SCROLL_PERCENTAGE, this.remove);
  }
}
export default ScrollPercentageTracker;