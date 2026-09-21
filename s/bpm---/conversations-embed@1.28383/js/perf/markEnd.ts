import { END_MARK_POST_DELAY, END_MARK_PRE_DELAY } from './constants';
export function markEndPostDelay() {
  try {
    performance.mark(END_MARK_POST_DELAY);
  } catch (e) {
    //
  }
}
export function markEndPreDelay() {
  try {
    performance.mark(END_MARK_PRE_DELAY);
  } catch (e) {
    //
  }
}