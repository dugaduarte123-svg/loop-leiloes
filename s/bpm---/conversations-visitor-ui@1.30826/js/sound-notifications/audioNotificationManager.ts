import { notification } from './audio';
class AudioNotificationManager {
  constructor() {
    this.playing = false;
    this._url = notification;
    this.audio = null;
    this.play = async () => {
      if (this.playing || !this.audio || !window.Audio) {
        return;
      }
      this.playing = true;
      try {
        await this.audio.play();
      } catch (e) {
        // Generally, this is due to the user not interacting with the page
      }
      this.playing = false;
    };
    this.audio = new Audio(this._url);
    this.audio.load();
  }
  set url(url) {
    this._url = url;
    // If Empty String, set audio to null
    if (!this._url) {
      this.audio = null;
    } else {
      this.audio = new Audio(this._url);
      this.audio.load();
    }
  }
  get url() {
    return this._url;
  }
}
export const audioNotificationManager = new AudioNotificationManager();