import { START_MARK_POST_DELAY, START_MARK_PRE_DELAY } from './constants';
export function markStartPreDelay() {
  try {
    performance.mark(START_MARK_PRE_DELAY);
  } catch (e) {
    //
  }
}
export function markStartPostDelay() {
  try {
    performance.mark(START_MARK_POST_DELAY);
  } catch (e) {
    //
  }
}